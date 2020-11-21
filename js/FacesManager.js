class FacesManager {
    constructor({svg, guiFolder, facesTypes, sideLength,isSingleNotch}) {
        const folder = guiFolder.addFolder("FacesManager");
        folder.open();
        this.notchDistance = 20;//No go
        this.sideLength = sideLength;
        this.update_ = () => this.update();
        const initMinSideLength = 10;
        const initMaxSideLength = 300;
        this.facesMain = document.createElementNS("http://www.w3.org/2000/svg",'g');
        this.facesClones = document.createElementNS("http://www.w3.org/2000/svg",'g');
        svg.appendChild(this.facesMain)
        this.facesMain.appendChild(this.facesClones)
        const initMinNotchDistance = 0;
        const initMaxNotchDistance = initMaxSideLength/2;
        this.posy=0;
        this.isSingleNotch=isSingleNotch;
        this.notchDistanceGUI = folder.add(this, 'notchDistance', initMinNotchDistance, initMaxNotchDistance, 0.1).onChange(this.updateNotchDistance.bind(this));
        this.faces = facesTypes.map(faceType => {
            const numberOfSides = faceType.sides;
            const notchedFace = new NotchedFace(this.facesMain, numberOfSides, folder,this.isSingleNotch);
            notchedFace.setForm(numberOfSides, sideLength);
            notchedFace.notchD=this.notchDistance;
            const amount = notchedFace.amount = faceType.amount;// no, no, no
            return notchedFace
        });
    }
    /**
     * 
     * @param {distance of center of notch to vertex} value 
     */
    updateNotchDistance(value){
        const faces = this.faces;
        faces.forEach(notchedFace => {
            notchedFace.setNotch(value);
            notchedFace.update(this.depth,this.gap)
        });
        this.update(this.depth,this.gap,false,this.posy)
    }
    update(depth,gap,isUpdating=true,posy=0) {
        if(posy>10){
            this.posy=posy;
            this.facesMain.setAttribute('transform',`translate(0,${posy})`)
        }
        this.depth=depth;
        this.gap=gap;
        const faces = this.faces;
        const notchMinima = [];
        faces.forEach(notchedFace => {
            notchedFace.isSingleNotch=this.isSingleNotch;
            notchedFace.setLength(this.sideLength)
            notchedFace.notchPrecompute(depth,gap)
            notchMinima.push(notchedFace.notchMin)
        });
        const notchDMax = Math.max.apply(null, notchMinima);
        this.notchDMax = notchDMax;
        const notchDistance = this.notchDistance;
        if(notchDistance>notchDMax||notchDistance<notchDMax){
            this.notchDistance = notchDMax
        }
        this.notchDistanceGUI.min(notchDMax);
        this.notchDistanceGUI.max(this.sideLength*0.5-gap*0.5);
        this.notchDistanceGUI.updateDisplay();
        if(isUpdating){
            this.updateNotchDistance(this.notchDistance);
        }
        this.removeOverlaps()
        this.facesClones.setAttribute('transform',`translate(0,${this.rMax*3})`)
        this.doClone();
    }
    updateLength(){
        const faces = this.faces;
        faces.forEach(notchedFace => {
            notchedFace.setLength(this.sideLength)
            notchedFace.update(this.depth,this.gap)
        });
        this.update(this.depth,this.gap);
        this.removeOverlaps()
    }
    removeOverlaps() {
        const faces = this.faces;
        let posX = 0;
        let rMax = 0;
        const radii = [];
        faces.forEach((notchedFace,i) => {
            const r = notchedFace.faceRadius;
            radii.push(r);
            if (r > rMax) {
                rMax = r;
            }
        })
        faces.forEach((notchedFace,i) => {
            notchedFace.setPosition(rMax*(2*i+1), rMax)
        })
        this.rMax=rMax;
    }
    doClone() {
        const faces = this.faces;
        this.facesClones.innerHTML = ""
        let accumulatedY = 2*this.rMax;//a diameter
        faces.forEach(face => {
           const facesColumns= 4;
           // const facesGroup = face.facesGroup
           const faceRadius = face.faceRadius
           const facesAmount = face.amount;
           const facesClones = document.createElementNS("http://www.w3.org/2000/svg",'g');
           this.facesClones.appendChild(facesClones);
           const bbox = this.facesClones.getBBox();
           const factor= 1;
           accumulatedY = bbox.height+Math.abs(bbox.y);
            facesClones.setAttribute('transform',`translate(${0},${accumulatedY})`)
            for (let index = 1; index < facesAmount; index++) {
                const faceClone = face.singleFacesGroup.cloneNode(true);
                facesClones.appendChild(faceClone);
                const u = index%facesColumns
                const v = index/facesColumns|0;
                const x=(faceRadius*2+margin)*u;
                const y=(faceRadius*2+margin)*v;
                faceClone.setAttribute('transform',`translate(${x},${y})`)
            }
            this.accumulatedY= accumulatedY;    
        });
    }}