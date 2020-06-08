export default function (currentSheetId) {
  const masterSheetId = 'savager-mastersheet';
  const currentSheet = document.getElementById(currentSheetId);
  let masterSheet = document.getElementById(masterSheetId);
  if (!masterSheet) {
    masterSheet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    masterSheet.id = masterSheetId;
    masterSheet.style.display = 'none';
    document.body.appendChild(masterSheet);
  }
  Array.prototype.slice.call(currentSheet.querySelectorAll('symbol')).forEach((symbol) => masterSheet.appendChild(symbol));
  currentSheet.remove();
}