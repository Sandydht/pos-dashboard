import { Component } from '@angular/core';
import { ClickOutsideDirective } from './click-outside-directive';
import { TestBed } from '@angular/core/testing';

@Component({
  template: '<div appClickOutside></div>',
  standalone: true,
  imports: [ClickOutsideDirective],
})
class TestHostComponent {}

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture).toBeTruthy();
  });
});
