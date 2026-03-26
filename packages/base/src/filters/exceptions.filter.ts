import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { GqlArgumentsHost, GqlContextType } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void | never {
    const type = host.getType<GqlContextType>();

    if (type === "graphql") {
      const gqlHost = GqlArgumentsHost.create(host);
      void gqlHost; // context available if needed
      throw this.toGraphQLError(exception);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.extractHttpInfo(exception);

    this.logger.error(
      `[REST] ${request.method} ${request.url} → ${status}: ${message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractHttpInfo(exception: unknown): {
    status: number;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === "string"
          ? res
          : ((res as { message?: string }).message ?? exception.message);
      return { status: exception.getStatus(), message };
    }
    this.logger.error(
      "Unhandled exception",
      exception instanceof Error ? exception.stack : exception,
    );
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    };
  }

  private toGraphQLError(exception: unknown): GraphQLError {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      const message =
        typeof res === "string"
          ? res
          : ((res as { message?: string }).message ?? exception.message);
      const code = this.httpStatusToGqlCode(exception.getStatus());
      return new GraphQLError(message, { extensions: { code } });
    }
    if (exception instanceof GraphQLError) return exception;
    this.logger.error(
      "Unhandled GQL exception",
      exception instanceof Error ? exception.stack : exception,
    );
    return new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }

  private httpStatusToGqlCode(status: number): string {
    const map: Record<number, string> = {
      400: "BAD_USER_INPUT",
      401: "UNAUTHENTICATED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "UNPROCESSABLE_ENTITY",
    };
    return map[status] ?? "INTERNAL_SERVER_ERROR";
  }
}
