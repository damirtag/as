import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();

    if (context.getType<GqlContextType>() === "graphql") {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.log(
              `[GQL] ${info.parentType.name}.${info.fieldName} — ${Date.now() - now}ms`,
            ),
          ),
        );
    }

    const req = context
      .switchToHttp()
      .getRequest<{ method: string; url: string }>();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`${req.method} ${req.url} — ${Date.now() - now}ms`),
        ),
      );
  }
}
