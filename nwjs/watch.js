if(ISNW){

    const chokidar = require('chokidar');
    chokidar.watch([
        'index.html'
        ,'index.js'
        ,'js/*'
        ,'nwjs/*'
    ]).on('change',()=>{location.reload(); });
    window.addEventListener('keydown',function(ev){
        if(ev.key==='F5'){location.reload()}
        if(ev.ctrlKey&&ev.key==='s'){location.reload()}
    })
}
