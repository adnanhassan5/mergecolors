

import  { assignStyleToFill } from "../functions";
import { getStyleId } from "../functions";
import { assignStyleToStroke } from "../functions";
import { rgbToHex } from "../functions";


const selection = figma.currentPage.selection;


// Get the selected nodes
const selectedNodes = figma.currentPage.selection;

if (selectedNodes.length > 0) {
  // Assume the first selected node is the target node
  //@ts-ignore
  
  //@ts-ignore
  const targetNode = selectedNodes[0].findAll(node => {
    return (
      node.type !== "GROUP" && 
      //@ts-ignore
      ((node.fills && node.fills.length > 0 && node.fills.every(fill => fill.type === "SOLID")) ||
      //@ts-ignore
        (node.strokes && node.strokes.length > 0 && node.strokes.every(stroke => stroke.type === "SOLID")))
  
    );
  });
  figma.currentPage.selection= targetNode;
  changecolors(targetNode)
  console.log(targetNode)}
  // Use the recursive function to collect all layers under the target node

// @ts-ignore
function changecolors(selection){
  if (selection.length > 0) {
    // @ts-ignore
    selection.forEach((node) => {
      // Check if the node has a fill
      // @ts-ignore
      if (node.fills) {
        // Iterate through each fill in the node
        // @ts-ignore
        node.fills.forEach((fill) => {
          // Check if the fill has a solid color
          if (fill.type === "SOLID" && fill.opacity===1 ) {
            
            console.log(fill.opacity)
            const colorHex = rgbToHex(fill.color, fill.opacity);
            // uniqueColors.add(colorHex);
  
            const styleidreturn = getStyleId(colorHex, 20);
  
            if (styleidreturn != null) {
              assignStyleToFill(node, styleidreturn);
            }
          }
        });
      }
      if ("strokes" in node) {
        if (node.strokes.length > 0) {
          // @ts-ignore
          if(node.strokes[0].opacity === 1){
          const colorHex = rgbToHex(node.strokes[0].color,node.strokes[0].opacity);
          // uniqueColors.add(colorHex);
  
          const styleidreturn = getStyleId(colorHex, 20);
  
          if (styleidreturn != null) {
            assignStyleToStroke(node, styleidreturn);
          }}
        }
      }
    });
  
    // figma.ui.postMessage({ type: 'colors', colors: uniqueColors });
  } else {
    console.log("No selections found.");
  }
  
}


figma.closePlugin();
