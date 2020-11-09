class NotchedFace{
    constructor(svg,sidesAmount,gui){
        this.isDebugging = false;
        this.isDebugging = true;
        this.facesDomContainer = document.createElement('div');
        document.body.appendChild(this.facesDomContainer);
        this.svgFaces = document.createElementNS("http://www.w3.org/2000/svg",'g');
        this.svgFaces.classList.add('face')
        this.facesDomContainer.appendChild(this.svgFaces);
        this.singleFacesGroup = document.createElementNS("http://www.w3.org/2000/svg",'g')
        this.singleFacesGroup.classList.add("single")
        svg.appendChild(this.singleFacesGroup);
        svg.appendChild(this.svgFaces);
        this.facesGroup = document.createElementNS("http://www.w3.org/2000/svg",'g');
        this.facesGroup.classList.add("group")
        this.svgFaces.appendChild(this.singleFacesGroup);
        this.svgFaces.appendChild(this.facesGroup);
        if(this.isDebugging&&false){
            this.debugRect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
            this.debugRect.setAttribute('width',20)
            this.debugRect.setAttribute('height',20)
            this.facesGroup.appendChild(this.debugRect);
        }
        this.sidesAmount = sidesAmount;
        // 
        this.sideLength = 300;
        this.faceRadius = -1;
        this.facesAmount = 12;
        this.facesColumns = 4;
        this.svgFaces.setAttribute('width','900');
        this.svgFaces.setAttribute('height','600');
        this.folderFaceType = gui.addFolder('NotchedFace '+sidesAmount);
        // this.folderFaceType.open();
        this.doUpdate = ()=>{
            // this.doFace(this.sides, this.sideLength);
            this.update();
        }
        this.sides=3;                        
        this.folderFaceType.add(this,'sides',3,12,1).onChange(this.doUpdate);
        this.folderFaceType.add(this,'facesAmount',1,12,1).onChange(this.doUpdate);
        this.folderFaceType.add(this,'facesColumns',1,12,1).onChange(this.doUpdate);
        // this.folderFaceType.add(this,'sideLength',50,400,0.5).name('side length').onChange(this.doUpdate);
    }
    setForm(sides,length){
        //order matters
        this.setSides(sides);
        this.setLength(length);
    }
    setLength(lengthInPixels){
        // this.sideLength = to_mm(lengthInPixels);
        this.sideLength = lengthInPixels;
        const l = this.sideLength;
        const degreePerRadian = Math.PI / 180;
        const theta = this.theta;
        const radius = 0.5*l / Math.sin(theta * degreePerRadian*0.5);
        this.faceRadius=radius;
    }
    setSides(n){
        this.sidesAmount=n;
        const sides = this.sidesAmount;
        const theta = 360 / sides;
        this.theta = theta;

    }
    update(s,gap) {
        const sides = this.sidesAmount;
        const length = this.sideLength;
        this.singleFacesGroup.innerHTML = ""
        const side = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        const tide = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        const gr   = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        const radius = this.faceRadius;
        if(this.isDebugging){
            const circle   = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            this.singleFacesGroup.appendChild(circle);
            circle.setAttribute("fill","none")
            circle.setAttribute("stroke","black")
            circle.setAttribute("r",radius)
        }
        this.singleFacesGroup.appendChild(gr);
        gr.appendChild(side);
        gr.appendChild(tide);
        // const l = to_mm(length);
        const notchD = this.notchD;//poorly created public variable
        const l = this.sideLength;
        // const dToVertex = to_mm(notchD );
        const dToVertex = notchD;
        // const g       = to_mm(gap)
        const g       = gap;
        const h0      = dToVertex;
        const gHalves = g   * 0.5;
        const h00     = h0  - gHalves;
        const h01     = h0  + gHalves;
        const h1      = l   - dToVertex;
        const h10     = h1  - gHalves;
        const h11     = h1  + gHalves;
        const midDist = h10 - h01;
        const endDist = l   - h11;
        // const depth   = to_mm(s);
        const depth   = s;
        side.setAttribute('stroke','black')
        tide.setAttribute('stroke','red')
        tide.setAttribute('stroke-width',4)
        tide.setAttribute('fill','none');
        let modelPoints = [
            [0,0],
            [h00,0],
            [h00,depth],
            [h01,depth],
            [h01,0],
            [h10,0],
            [h10,depth],
            [h11,depth],
            [h11,0],
            [l,0]
        ]
        side.setAttribute('fill','none');
        const dString = `M 0 0 h ${h00} v ${depth} h ${g} v ${-depth} h ${midDist} v ${depth} h ${g} v ${-depth} h ${endDist}`;
        side.setAttribute('d',dString);
        // const theta = 360 / sides;
        const theta = this.theta;
        const degreePerRadian = Math.PI / 180;
        let outerAngleOffset2 = 90 + 0.5 * theta;
        outerAngleOffset2 = 90
        let allPoints = []
        for (let index = 0; index < sides; index++) {
            const angleDegree = theta * index + outerAngleOffset2;
            const angle       = angleDegree * degreePerRadian;
            const x           = Math.cos(angle) * radius;
            const y           = Math.sin(angle) * radius;
            let clonePoints;
            if(true){

                clonePoints = modelPoints
                    .map(point => [point[0]+x,point[1]+y])
                    .map(point => HingedPolyhedron.rotate2D(point,angleDegree))
            }else{
                clonePoints = modelPoints.map(point => [point[0]+x,point[1]+y]);
                // clonePoints = clonePoints.map(point => HingedPolyhedron.rotate2D(point,angleDegree));
    
            }
            // clonePoints.shift()
            allPoints = [...allPoints,...clonePoints]
        }
        console.log('aaa: ', allPoints);
        const sidePathString = HingedPolyhedron.arrayToPath(allPoints);
        tide.setAttribute('d',sidePathString);
        // const radius = 0.5*l / Math.sin(theta * degreePerRadian*0.5);
        // circle.setAttribute("cx",0)
        // circle.setAttribute("cy",0)
        const outerAngleOffset = 90 + 0.5 * theta;
        for (let index = 1; index < sides; index++) {
            const angleDegree = theta * index;
            const outerAngle  = angleDegree + outerAngleOffset;
            const angle       = angleDegree * degreePerRadian;
            const x           = Math.cos(angle) * radius;
            const y           = Math.sin(angle) * radius;
            const sideN       = side.cloneNode();
            gr.appendChild(sideN);
            sideN.setAttribute('transform',`translate(${x},${y}) rotate(${outerAngle})`)
        }
        side.setAttribute('transform',`translate(${radius},0) rotate(${outerAngleOffset})`)
        // gr.setAttribute('transform',`translate(${radius},${radius})`)
        return gr;
    }
    setNotch(value){
        this.notchD = value;
    }
    setPosition(x,y){
        this.singleFacesGroup.setAttribute('transform',`translate(${x},${y})`)
        // this.update()
    }
    notchPrecompute(s,gap){
        const a = Math.PI / this.sidesAmount;
        const minh = 2*s*Math.tan(a)// see notch-distance.svg at docs folder
        const gHalves = gap / 2;
        const actualMin = minh + gHalves;
        this.notchMin = actualMin;
        return actualMin
        contrlrNotchD.min(actualMin);
        contrlrNotchD.max(sideLength*0.5-gap);
        if(notchD-gHalves<minh){
            notchD=actualMin;
        }
        contrlrNotchD.updateDisplay();
    }
}