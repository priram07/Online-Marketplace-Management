import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

/**
 * Custom Pipe: validates & transforms a route param into a positive integer.
 * Demonstrates a hand-written Pipe (in addition to the global ValidationPipe).
 */
@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(
        `Validation failed: "${metadata.data}" must be a positive integer`,
      );
    }
    return val;
  }
}
