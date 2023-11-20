(async () => {
  let gt = (globalThis as any)
  gt.StackIs = false;

  // {{INJECTHERE1}}
  
  try {
    gt.cores = await Promise.all([

      // @ Serve Vital Chub Here.
      // {{INJECTHERE2}}

    ].map(a => import(a)));
  } catch (e) {

    throw new Error('Failed to import cores:  ' + e)
  }

  gt.StackIs = true;
  gt?.StackLoaded(
    gt.cores,
  );

})();