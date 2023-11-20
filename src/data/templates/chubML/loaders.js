void async function() {

  globalThis.cores = await new Promise.all([

    // @ Serve Vital Chub Here.
    
  ].map(a => import(a)))
  
}()