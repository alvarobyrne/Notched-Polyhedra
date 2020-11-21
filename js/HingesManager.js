class HingesManager {
    constructor({svg, guiFolder, dihedralAngles, facesSidesAmounts, hingesAmounts,isSingleNotch}) {
        this.hingesAmounts = hingesAmounts;
        this.edgesTypes = Object.keys(hingesAmounts);
        const folder = guiFolder.addFolder('HingesManager');
        this.w = 100;//pixels
        this.margin=margin;
        this.dist = 3//mm
        this.columns = 4;
        folder.open()
        this.hinges=[];
        this.isSingleNotch=isSingleNotch;
        let i =0
        const posx = 200;
        for (const key in dihedralAngles) {
            if (dihedralAngles.hasOwnProperty(key)) {
                // console.log('key: ', key);
                const angle = dihedralAngles[key];
                const faceSidesAmount = facesSidesAmounts[i];
                const hinge = new Hinge(svg, folder, angle, faceSidesAmount, this.w, this.dist,posx*i)
                this.hinges.push(hinge)
            }
            i++
        }
        folder.add(this, 'w', 5, 20).name("hinge size, (w)[mm]").onChange(this.updateSize.bind(this))
        folder.add(this, 'dist', 2.5, 10).onChange(this.updateSize.bind(this))
        this.clones = document.createElementNS("http://www.w3.org/2000/svg",'g')
        svg.appendChild(this.clones);
        this.updateSize()
    }
    updateSize() {
        this.hinges.forEach(hinge => {
            hinge.w = to_mm(this.w);
            hinge.dist = to_mm(this.dist);
        });
        this.update(this.s, this.g);
    }
    update(s, g) {
        var isAutoCloning;
        isAutoCloning = false;
        isAutoCloning = true;
        this.s = s;
        this.g = g;
        this.hinges.forEach(hinge => {
            hinge.update(s, g)
        });
        if (isAutoCloning) {
            this.doClearClones()
            this.doCloneHinges()
        } else {
            this.doClearClones()
        }
    }
    doCloneHinges(params) {
        // console.trace();
        let accumulatedH = 0;

        const bbox = this.hinges[0].original.getBBox();
        this.clones.setAttribute('transform',`translate(0,${bbox.height})`)
        this.hinges.forEach((element, i) => {
            // console.log('i: ', i);
            const type = this.edgesTypes[i];
            // console.log('type: ', type);
            // console.log('element: ', element);
            let factor = 2
            if(this.isSingleNotch)
            factor=1;
            const hingesAmount = this.hingesAmounts[type]*factor;
            // console.log('hingesAmount: ', hingesAmount);
            this.doCloneHinge(element,hingesAmount,accumulatedH);
            const bbox = this.clones.getBBox();
            accumulatedH=bbox.height;
            // console.log('accumulatedH: ', accumulatedH);
        });
    }
    doClearClones() {
        this.clones.innerHTML = ""
    }
    doCloneHinge(hinge, cloneAmount,accumulatedH) {
        const margin = this.margin;
        const columns = this.columns;
        const clonesAmount = cloneAmount / 2 | 0;
        const original = hinge.original;
        const bbox = original.getBBox();
        const cloneTx = bbox.width;
        const cloneTy = bbox.height;
        for (let index = 1; index < clonesAmount; index++) {
            const qiece = original.cloneNode(true);
            this.clones.appendChild(qiece);
            const u = index % columns
            const v = index / columns | 0;
            // const x = u*(r+w+margin*0.5)+r+margin;
            const x = u * (cloneTx + margin) + margin;
            const y = v * (cloneTy + margin) + margin;
            const accumulatedHeight = accumulatedH+y + h + 10;
            this.accumulatedHeight = accumulatedHeight; 
            qiece.setAttribute("transform", `translate(${x},${accumulatedHeight})`)
        }
    }
}