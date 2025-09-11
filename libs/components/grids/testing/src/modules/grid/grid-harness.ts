import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyGridHarnessFilters } from './grid-harness-filters';

/**
 * Harness for interacting with a grid component in tests.
 */
export class SkyGridHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-grid';

  #getRows = this.locatorForAll('tbody tr');
  #getHeaders = this.locatorForAll('thead th');
  #getToolbar = this.locatorForOptional('.sky-grid-toolbar');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyGridHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyGridHarnessFilters,
  ): HarnessPredicate<SkyGridHarness> {
    return SkyGridHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the number of rows in the grid.
   */
  public async getRowCount(): Promise<number> {
    const rows = await this.#getRows();
    return rows.length;
  }

  /**
   * Gets the number of columns in the grid.
   */
  public async getColumnCount(): Promise<number> {
    const headers = await this.#getHeaders();
    return headers.length;
  }

  /**
   * Gets the text content of a specific cell.
   */
  public async getCellText(rowIndex: number, columnIndex: number): Promise<string> {
    const rows = await this.#getRows();
    if (rowIndex >= rows.length) {
      throw new Error(`Row index ${rowIndex} is out of bounds. Grid has ${rows.length} rows.`);
    }
    
    const cells = await this.locatorForAll(`tbody tr:nth-child(${rowIndex + 1}) td`)();
    if (columnIndex >= cells.length) {
      throw new Error(`Column index ${columnIndex} is out of bounds. Row has ${cells.length} cells.`);
    }
    
    return await cells[columnIndex].text();
  }

  /**
   * Gets the header text for a specific column.
   */
  public async getColumnHeaderText(columnIndex: number): Promise<string> {
    const headers = await this.#getHeaders();
    if (columnIndex >= headers.length) {
      throw new Error(`Column index ${columnIndex} is out of bounds. Grid has ${headers.length} columns.`);
    }
    
    return await headers[columnIndex].text();
  }

  /**
   * Clicks a specific cell in the grid.
   */
  public async clickCell(rowIndex: number, columnIndex: number): Promise<void> {
    const rows = await this.#getRows();
    if (rowIndex >= rows.length) {
      throw new Error(`Row index ${rowIndex} is out of bounds. Grid has ${rows.length} rows.`);
    }
    
    const cells = await this.locatorForAll(`tbody tr:nth-child(${rowIndex + 1}) td`)();
    if (columnIndex >= cells.length) {
      throw new Error(`Column index ${columnIndex} is out of bounds. Row has ${cells.length} cells.`);
    }
    
    await cells[columnIndex].click();
  }

  /**
   * Gets whether the grid has a toolbar.
   */
  public async hasToolbar(): Promise<boolean> {
    const toolbar = await this.#getToolbar();
    return toolbar !== null;
  }

  /**
   * Gets all row data as an array of arrays.
   */
  public async getRowData(): Promise<string[][]> {
    const rows = await this.#getRows();
    const rowData: string[][] = [];
    
    for (const row of rows) {
      const cells = await this.locatorForAll(`tbody tr:nth-child(${rows.indexOf(row) + 1}) td`)();
      const cellTexts = await Promise.all(cells.map(cell => cell.text()));
      rowData.push(cellTexts);
    }
    
    return rowData;
  }

  /**
   * Gets all column header texts.
   */
  public async getColumnHeaders(): Promise<string[]> {
    const headers = await this.#getHeaders();
    return await Promise.all(headers.map(header => header.text()));
  }
}
