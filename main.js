(() => {

    let fs = require("fs");
    let gexf = require("gexf");
    let path = require('path');

    let xMax = 0;
    let xMin = 0;

    let yMin = 0;
    let yMax = 0;

    let gexf_file = fs.readFileSync('./files/raw_grapgh_revo_all.gexf', 'utf-8');

    let graph = gexf.parse(gexf_file);

    graph.nodes.forEach((node, index) => {
        let id = node.id;
        id = id.substring(1, id.length - 1);
        [clusterIndex, nodeLocalIndex] = id.split(",");
        let clusterInt = Number(clusterIndex);
        node.cluster = clusterInt;

        // let xPosition = Number(node.viz.position.x);
        // let yPosition = Number(node.viz.position.y);

        // if (xPosition > xMax) {
        //     xMax = xPosition;
        // }
        // if (xPosition < xMin) {
        //     xMin = xPosition
        // }
        // if (yPosition > yMax) {
        //     yMax = yPosition;
        // }
        // if (yPosition < yMin) {
        //     yMin = yPosition
        // }
    });

    graph.meta.xMin = xMin;
    graph.meta.xMax = xMax;

    graph.meta.yMin = yMin;
    graph.meta.yMax = yMax;

    graph.edges.forEach((edge, index) => {
        let source = edge.source;
        source = source.substring(1, source.length - 1);
        [sCluster, sSelfIndex] = source.split(",");
        let sourceIndex = Number(sCluster) * 48 + Number(sSelfIndex);
        edge.source = sourceIndex;
        let target = edge.target;
        [tCluster, tSelfIndex] = target.substring(1, target.length - 1).split(",");
        let targetIndex = Number(tCluster) * 48 + Number(tSelfIndex);
        edge.target = targetIndex;
    });

    let graph_json = JSON.stringify(graph);

    fs.readFile(path.join(__dirname, "./mygraph_4.json"), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            fs.writeFile("mygraph_3.json", graph_json, 'utf8', () => { console.log("please check the json file") });
        }
    })
})()