import { AngularGraphsPage } from './app.po';

describe('angular-graphs App', () => {
  let page: AngularGraphsPage;

  beforeEach(() => {
    page = new AngularGraphsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
