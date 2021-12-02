const SCCProductPageSelector = (state) => state.foremanSccManager;

export const selectSCCProducts = (state) => {
  console.debug(state);
  SCCProductPageSelector(state).sccProducts;
};

export const selectSCCAccountId = (state) =>
  SCCProductPageSelector(state).sccAccountId;
