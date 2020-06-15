export default function (currentSheetId, masterSheetId) {
  const currentSheet = document.getElementById(currentSheetId);
  if (!currentSheet) {
    return;
  }

  let masterSheet = document.getElementById(masterSheetId);
  if (!masterSheet) {
    masterSheet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    masterSheet.id = masterSheetId;
    masterSheet.style.display = 'none';
    document.body.appendChild(masterSheet);
  }

  Array.prototype.slice.call(currentSheet.querySelectorAll('symbol')).forEach((symbol) => {
    if (!masterSheet.getElementById(symbol.id)) {
      masterSheet.appendChild(symbol);
    }
  });
  currentSheet.remove();
}