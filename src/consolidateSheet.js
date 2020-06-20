/**
 * Consolidates reference sheets into a single primary sheet
 * @param {String} currentSheetId - The id of the sheet that provides this function
 * @param {String} masterSheetId - The id of the primary sheet to consolidate into
 */

export default function (currentSheetId, masterSheetId) {
  const currentSheet = document.getElementById(currentSheetId);
  if (!currentSheet) {
    return;
  }

  if (!masterSheetId) {
    masterSheetId = 'savager-primarysheet';
  }

  let masterSheet = document.getElementById(masterSheetId);
  if (!masterSheet) {
    masterSheet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    masterSheet.id = masterSheetId;
    masterSheet.style.display = 'none';
    document.body.appendChild(masterSheet);
  }

  Array.prototype.slice.call(currentSheet.querySelectorAll('symbol')).forEach((symbol) => {
    !masterSheet.getElementById(symbol.id) && masterSheet.appendChild(symbol)
  });
  currentSheet.remove();
}