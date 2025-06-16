export const TIPOS_CODIGO_BARRA = {
    // Código QR, común en menús, enlaces web, pagos, etc.
    qr: 'qr',
  
    // Code 39: común en logística, almacenes, sistemas industriales (el que usas tú)
    code39: 'code39',
  
    // Code 93: mejora del Code 39, más denso, también en logística
    code93: 'code93',
  
    // Code 128: ampliamente usado en envíos, logística, cadenas de suministro
    code128: 'code128',
  
    // EAN-13: común en supermercados a nivel mundial (13 dígitos)
    ean13: 'ean13',
  
    // EAN-8: versión más corta del EAN-13 (8 dígitos), usado en empaques pequeños
    ean8: 'ean8',
  
    // UPC-A: estándar en EE. UU. para códigos de productos (12 dígitos)
    upc_a: 'upc_a',
  
    // UPC-E: versión comprimida del UPC-A (para empaques pequeños)
    upc_e: 'upc_e',
  
    // PDF417: usado en documentos de identidad, boarding passes, licencias de conducción
    pdf417: 'pdf417',
  
    // Codabar: sistemas antiguos como bancos de sangre, bibliotecas
    codabar: 'codabar',
  
    // ITF-14: códigos para cajas o empaques al por mayor
    itf14: 'itf14',
  
    // DataMatrix: pequeño y denso, usado en medicina, componentes electrónicos
    datamatrix: 'datamatrix',
  
    // Aztec: muy usado en boletos de transporte (pasajes de avión, buses)
    aztec: 'aztec',
  } as const;
  