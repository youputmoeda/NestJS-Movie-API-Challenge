import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

/**
 * LoggerMiddleware
 *
 * A middleware that logs details of each HTTP request and response.
 * It calculates the duration of the request by capturing the time before
 * and after the request is processed.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	/**
	 * Logs the request and response details, including:
	 * - HTTP method
	 * - Requested URL
	 * - Response status code
	 * - Duration (in milliseconds)
	 *
	 * @param {Request} req - The incoming HTTP request object.
	 * @param {Response} res - The outgoing HTTP response object.
	 * @param {NextFunction} next - The callback function to call the next middleware.
	 */
	use(req: Request, res: Response, next: NextFunction) {
		const { method, originalUrl } = req;
		const start = Date.now();

		res.on('finish', () => {
			const duration = Date.now() - start;
			console.log(
				`[${new Date().toISOString()}] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
			);
		});

		next();
	}
}
