# HCI's Angular Grid Library

## Intro
    This grid is designed to be a full featured grid that can handle nearly anything that complex data tables may
    be expected to support.  By default, the grid is simple and basic, but becomes full featured through
    configuration.

## Basic Features

* **Sorting:** Change sorting by clicking on column header.
* **Filtering:** String, select, range filtering with the possibility for custom filters.
* **Paging:** Paging with various page sizes, first, last, previous and next.
* **Row Grouping:** Rows can be grouped by one or more columns.
* **External Data Call:** Callback to retrieve data from external source.
* **Custom Events:** Listeners can be added to work for specific events and custom actions can be taken.

## Usage

The basic syntax is:

    <hci-grid
      [data]="dataArray"
      [columnDefinitions]="[
        { field: "col1", name: "Column 1" },
        { field: "col2", name: "Column 2" },
      ]">
    </hci-grid>

## Advanced Features


