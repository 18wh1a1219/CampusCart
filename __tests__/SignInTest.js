import React from 'react';
import renderer from 'react-test-renderer';
import SignIn from '../screens/SignIn';

test('renders correctly', () => {
  const tree = renderer.create(<SignIn />).toJSON();
  expect(tree).toMatchSnapshot();
});
