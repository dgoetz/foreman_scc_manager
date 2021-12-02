import componentRegistry from 'foremanReact/components/componentRegistry';
import SCCProductPage from './components/SCCProductPage';
import reducer from './reducer';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';

componentRegistry.register({
  name: 'SCCProductPage',
  type: SCCProductPage,
});

injectReducer('foremanSccManager', reducer);
