const ISNW=typeof nw !== 'undefined';
if(ISNW){

    var fs = require('fs');
    var path = require('path');
    var CWD = process.cwd();
    const baseName = 'dihedral';
    const baseDirName = 'tmp';
    const fileExtension = 'svg';
    // const svgExportPath = 'tmp/dihedral.svg';
    const fileName = baseName +'.'+fileExtension;
    console.log('fileName: ', fileName);
    
    var svgExportPath = path.join(baseDirName, fileName);
    var tmpSVGPath = path.join(CWD, svgExportPath);
    console.log('tmpSVGPath: ', tmpSVGPath);
    var shell = nw.Shell;
    function pre_exportSVG() {
        // svg.appendChild(singleFacesGroup);
        // svg.appendChild(facesGroup);
        let svg = document.querySelectorAll("#bins svg");
        console.log('svg: ', svg);
        let svgs = Array.from(svg);
        console.log('svgs: ', svgs);
        if(svgs.length<1){
            svg = document.querySelector("#svg");
            doExportSVG(svg,svgExportPath)
            return [svgExportPath]
        }else{
            return svgs.map((svg,i) => {
                const fileName = baseName + i+'.'+fileExtension;
                console.log('fileName: ', fileName);
                // console.log('svg: ', svg);
                return fileName
            });
        }
        
        // svgFaces.appendChild(singleFacesGroup);
        // svgFaces.appendChild(facesGroup);
    }
    function doExportSVG(svg,name) {
        svg.removeAttribute("width")
        svg.removeAttribute("height")
        
        var outerHTML = svg.outerHTML
        
        fs.writeFileSync(name,outerHTML,'utf8')
    
    }
    function exportSVG() {
        const filez = pre_exportSVG();
        console.log('filez: ', filez);
        var tmpSVGPath = path.join(CWD, filez[0]);
        shell.openItem(tmpSVGPath);
        //["tmp\dihedral.svg"]
    }
}