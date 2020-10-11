import 'react-native';
import * as React from 'react';
import {create} from 'react-test-renderer';
// 이유는 모르나 react가 test code에서 import가 되지 않음
global.React = React;

import App from './App';
describe('<App />', () => {
  it('has 1 child', () => {
    const tree =create(<App />).toJSON();
    expect(tree).not.toBe(null);
  });
});
test('renders correctly', () => {
  const tree = create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

