class SvgNestClient{
    constructor(gui,output){
        this.output=output;
        this.efficiency = 0;
        this.placed     = 0;
        this.total      = 0;
        this.svglist    = null;
        this.params     = 0;
        const folder = gui.addFolder('svgnest');
        folder.open();
        folder.add(SvgNest,'stop')
        folder.add(this,'params',0,1,0.01).listen()
        folder.add(this,'efficiency',0,1,0.01).listen()
        folder.add(this,'placed').listen()
        folder.add(this,'total').listen()
        folder.add(this,'start');
        this.binId="bin";
        folder.add(this,"binId")
        this.svgElementId="svg";
        folder.add(this,"svgElementId")
        this.parsedSVG = null;
    }
    parsesvg(svgElementId){
        this.input  = document.querySelector('#' + svgElementId);
        const svgString = this.input.outerHTML;
        this.parsedSVG = SvgNest.parsesvg(svgString);
    }
    start(){
        this.parsesvg(this.svgElementId);
        this.setBin(this.binId);
        SvgNest.start(this.progress.bind(this), this.renderSvg.bind(this));
    }
    setBin(binId){
        const bin = this.parsedSVG.querySelector('#' + binId);
        SvgNest.setbin(bin)
    }
    renderSvg(svglist, efficiency, placed, total){
        if(!svglist || svglist.length == 0){
            return;
        }
        this.set_efficiency( efficiency);
        this.set_placed( placed);
        this.set_total( total);
        this.set_svglist( svglist);
        this.output.innerHTML = '';
        this.input.style.display='none'
        for(var i=0; i<svglist.length; i++){
            if(svglist.length > 2){
                svglist[i].setAttribute('class','grid');
            }
            this.output.appendChild(svglist[i]);
        }
        SvgNest.stop()
            
    }
    progress(params) {
        console.log('params: ', params);
        this.params=params;
        // console.log('this: ', this);
    }
    
    set_efficiency(efficiency){
        this.efficiency=efficiency;
        // console.log('this: ', this);
    }
    set_placed(placed){
        this.placed=placed;
    }
    set_total(total){
        this.total=total;
    }
    set_svglist(svglist){
        this.svglist=svglist;
        return
        var bins = document.getElementById('bins');
        bins.innerHTML = '';
        
        for(var i=0; i<svglist.length; i++){
            if(svglist.length > 2){
                svglist[i].setAttribute('class','grid');
            }
            bins.appendChild(svglist[i]);
        }
    }
}
