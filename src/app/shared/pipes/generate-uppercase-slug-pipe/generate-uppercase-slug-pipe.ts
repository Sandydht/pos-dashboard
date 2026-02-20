import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateUppercaseSlug',
})
export class GenerateUppercaseSlugPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 20);
  }
}
