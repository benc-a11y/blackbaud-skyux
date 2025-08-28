import { Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalConfiguration {
  public fullPage?: boolean;
  public size?: string;
  public ariaRole?: string;
  public wrapperClass?: string;

  constructor() {
    this.size = 'medium';
  }
}
