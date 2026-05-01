const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelManager {
  constructor(rutaArchivo) {
    this.rutaArchivo = rutaArchivo;
    this.asegurarDirectorio();
  }

  // Asegurar que existe el directorio
  asegurarDirectorio() {
    const directorio = path.dirname(this.rutaArchivo);
    if (!fs.existsSync(directorio)) {
      fs.mkdirSync(directorio, { recursive: true });
    }
  }

  // Crear o cargar el workbook
  async obtenerWorkbook() {
    let workbook;
    
    if (fs.existsSync(this.rutaArchivo)) {
      workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(this.rutaArchivo);
    } else {
      workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Formularios');
      
      // Crear encabezados
      worksheet.columns = [
        { header: 'N°', key: 'id', width: 5 },
        { header: 'Nombre', key: 'nombre', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Dispositivo', key: 'dispositivo', width: 15 },
        { header: 'Servicio', key: 'servicio', width: 25 },
        { header: 'Problema', key: 'problema', width: 40 },
        { header: 'Fecha Preferida', key: 'fechaContacto', width: 15 },
        { header: 'Fecha Registro', key: 'fechaRegistro', width: 20 }
      ];

      // Estilo de encabezados
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' };

      await workbook.xlsx.writeFile(this.rutaArchivo);
    }

    return workbook;
  }

  // Agregar un nuevo dato
  async agregarDato(dato) {
    try {
      const workbook = await this.obtenerWorkbook();
      const worksheet = workbook.getWorksheet('Formularios');
      
      // Obtener el número total de filas (excluyendo encabezado)
      const rowCount = worksheet.rowCount;
      const numeroRow = rowCount;

      // Agregar fila con datos
      const row = worksheet.addRow({
        id: numeroRow,
        nombre: dato.nombre,
        email: dato.email,
        telefono: dato.telefono,
        dispositivo: dato.dispositivo,
        servicio: dato.servicio,
        problema: dato.problema,
        fechaContacto: dato.fechaContacto,
        fechaRegistro: dato.fechaRegistro
      });

      // Aplicar estilos a la fila
      row.alignment = { horizontal: 'left', vertical: 'center', wrapText: true };
      row.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };

      // Guardar el archivo
      await workbook.xlsx.writeFile(this.rutaArchivo);
      
      console.log(`✓ Formulario agregado: ${dato.nombre} (${new Date().toLocaleTimeString('es-AR')})`);
      
      return {
        success: true,
        id: numeroRow
      };
    } catch (error) {
      console.error('Error en agregarDato:', error);
      throw error;
    }
  }

  // Obtener todos los datos
  async obtenerDatos() {
    try {
      const workbook = await this.obtenerWorkbook();
      const worksheet = workbook.getWorksheet('Formularios');
      
      const datos = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Saltar encabezados
          datos.push(row.values);
        }
      });

      return datos;
    } catch (error) {
      console.error('Error en obtenerDatos:', error);
      throw error;
    }
  }

  // Obtener cantidad de registros
  async obtenerCantidadRegistros() {
    try {
      const workbook = await this.obtenerWorkbook();
      const worksheet = workbook.getWorksheet('Formularios');
      return worksheet.rowCount - 1; // -1 para excluir el encabezado
    } catch (error) {
      console.error('Error en obtenerCantidadRegistros:', error);
      throw error;
    }
  }
}

module.exports = ExcelManager;
