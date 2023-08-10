import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
  transform(value: any[], key: string): any {
    if (!value || !key) {
      return value;
    }

    const result = value.reduce((acc, item) => {
      const property = item[key];
      acc[property] = acc[property] || [];
      acc[property].push(item);
      return acc;
    }, {});

    return Object.values(result);
  }
}