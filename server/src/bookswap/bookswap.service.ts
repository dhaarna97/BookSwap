import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Bookswap, BookswapDocument } from "./bookswap.schema";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "src/user/user.schema";
import { PostBookDto } from "./bookswap.dto";
import { AuthService } from "src/auth/auth.service";
import { Request, Response } from "express";
import { Status } from "./bookswap.enum";

@Injectable()
export class BookswapService {
    constructor(
        @InjectModel(Bookswap.name) private bookswapSchema: Model<BookswapDocument>,
        @InjectModel(User.name) private userSchema: Model<UserDocument>,
        private readonly authService: AuthService
    ) { }

    async postBook(bookDto: PostBookDto, userId: string): Promise<any> {
        const book = await this.bookswapSchema.create({
            ...bookDto,
            owner: userId,
        });
        return {
            message: "Book posted successfully",
            data: book
        };
    }

    async getAllBooks(): Promise<any> {
        const books = await this.bookswapSchema.find().populate('owner', 'name email avatar');
        return {
            message: "Books retrieved successfully",
            data: books
        }
    }

    async getMyBooks(userId: string): Promise<any> {
        const books = await this.bookswapSchema.find({ owner: userId });
        return {
            message: "Your books retrieved successfully",
            data: books
        }
    }

    async getBookById(bookId: string): Promise<any> {
        const book = await this.bookswapSchema.findById(bookId).populate('owner', 'name email avatar');
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        return {
            message: "Book retrieved successfully",
            data: book
        };
    }


    async updateBook(bookId: string, userId: string, updateData: Partial<PostBookDto>): Promise<any> {
        const book = await this.bookswapSchema.findOne({ _id: bookId, owner: userId });
        if (!book) throw new NotFoundException('Book not found or you are not allowed to update');

        const updatedBook = await this.bookswapSchema.findOneAndUpdate(
            { _id: bookId, owner: userId },
            updateData,
            { new: true } 
        );

        return {
            message: "Book updated successfully",
            data: updatedBook
        };
    }

    async deleteBook(bookId: string, userId: string): Promise<any> {
        const deletedBook = await this.bookswapSchema.findOneAndDelete({ _id: bookId, owner: userId });
        if (!deletedBook) throw new NotFoundException('Book not found or you are not allowed to delete');

        return {
            message: "Book deleted successfully",
            data: deletedBook
        };
    }

    async extractUserIdFromToken(req: Request, res: Response): Promise<string | null> {
        try {
          const authorizationToken = req.headers.authorization;
          if (!authorizationToken) {
            res.status(401).json({ message: 'No authorization token provided' });
            return null;
          }
    
          const { tokenPayload }: any = this.authService.decodeAuthToken(authorizationToken);
          if (!tokenPayload || !tokenPayload.id) {
            res.status(401).json({ message: 'Invalid token payload' });
            return null;
          }
    
          const verifiedPayload = this.authService.verifyAuthToken(authorizationToken);
          return verifiedPayload.id;
        } catch (error) {
          res.status(401).json({ 
            message: 'Invalid or expired token',
            error: error.message 
          });
          return null;
        }
      }

    // Book Request Methods
    async requestBook(bookId: string, userId: string): Promise<any> {
        const book = await this.bookswapSchema.findById(bookId);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        // Check if user is trying to request their own book
        if (book.owner.toString() === userId) {
            throw new Error('You cannot request your own book');
        }

        // Check if user already has a pending request for this book
        const existingRequest = book.requests.find(
            req => req.user.toString() === userId && req.status === Status.PENDING
        );
        if (existingRequest) {
            throw new Error('You already have a pending request for this book');
        }

        // Add the request
        book.requests.push({
            user: new Types.ObjectId(userId),
            status: Status.PENDING,
            createdAt: new Date()
        });
        book.totalRequests += 1;

        await book.save();

        return {
            message: 'Book request sent successfully',
            data: book
        };
    }

    async handleBookRequest(requestId: string, action: 'accept' | 'decline', ownerId: string): Promise<any> {
        const book = await this.bookswapSchema.findOne({
            'requests._id': requestId,
            owner: ownerId
        }).populate('requests.user', 'name email');

        if (!book) {
            throw new NotFoundException('Request not found or you are not authorized');
        }

        const request = book.requests.find(req => req._id.toString() === requestId);
        if (!request) {
            throw new NotFoundException('Request not found');
        }

        if (request.status !== Status.PENDING) {
            throw new Error('Request has already been processed');
        }

        request.status = action === 'accept' ? Status.ACCEPTED : Status.DECLINED;
        await book.save();

        return {
            message: `Request ${action}ed successfully`,
            data: { book, request }
        };
    }

    async getMyRequests(userId: string): Promise<any> {
        const books = await this.bookswapSchema.find({
            'requests.user': userId
        })

        const myRequests = [];
        books.forEach(book => {
            const userRequest = book.requests.find(req => req.user.toString() === userId);
            if (userRequest) {
                myRequests.push({
                    requestId: userRequest._id,
                    book: {
                        _id: book._id,
                        title: book.title,
                        author: book.author,
                        condition: book.condition,
                        image: book.image,
                        owner: book.owner
                    },
                    status: userRequest.status,
                    createdAt: userRequest.createdAt
                });
            }
        });

        return {
            message: 'Your requests retrieved successfully',
            data: myRequests
        };
    }

    async getReceivedRequests(userId: string): Promise<any> {
        const books = await this.bookswapSchema.find({
            owner: userId,
            'requests.0': { $exists: true }
        }).populate('requests.user', 'name email avatar');

        const receivedRequests = [];
        books.forEach(book => {
            book.requests.forEach(request => {
                receivedRequests.push({
                    requestId: request._id,
                    book: {
                        _id: book._id,
                        title: book.title,
                        author: book.author,
                        condition: book.condition,
                        image: book.image
                    },
                    requester: request.user,
                    status: request.status,
                    createdAt: request.createdAt
                });
            });
        });

        return {
            message: 'Received requests retrieved successfully',
            data: receivedRequests
        };
    }

    async cancelBookRequest(requestId: string, userId: string): Promise<any> {
        const book = await this.bookswapSchema.findOne({
            'requests._id': requestId,
            'requests.user': userId
        });

        if (!book) {
            throw new NotFoundException('Request not found or you are not authorized to cancel this request');
        }

        const requestIndex = book.requests.findIndex(
            req => req._id.toString() === requestId && req.user.toString() === userId
        );

        if (requestIndex === -1) {
            throw new NotFoundException('Request not found');
        }

        const request = book.requests[requestIndex];
        if (request.status !== Status.PENDING) {
            throw new Error('Can only cancel pending requests');
        }

        book.requests.splice(requestIndex, 1);
        book.totalRequests -= 1;
        await book.save();

        return {
            message: 'Request cancelled successfully',
            data: { requestId, bookTitle: book.title }
        };
    }

    async getBookRequests(bookId: string, ownerId: string): Promise<any> {
        const book = await this.bookswapSchema.findOne({
            _id: bookId,
            owner: ownerId
        }).populate('requests.user', 'name email avatar');

        if (!book) {
            throw new NotFoundException('Book not found or you are not the owner');
        }

        return {
            message: 'Book requests retrieved successfully',
            data: {
                book: {
                    _id: book._id,
                    title: book.title,
                    author: book.author,
                    condition: book.condition,
                    image: book.image
                },
                requests: book.requests
            }
        };
    }
}
