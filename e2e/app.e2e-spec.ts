import { AppPage } from './app.po';

describe('ponyracer App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect($('h1').getText()).toBe('Ponyracer Always a pleasure to bet on ponies');
  });
});