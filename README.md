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

The basic syntax for data provided by the implementing component.

    <hci-grid
      [data]="dataArray"
      [columnDefinitions]="[
        { field: "col1", name: "Column 1" },
        { field: "col2", name: "Column 2" },
      ]">
    </hci-grid>

The basic syntax for an external data call.

    <hci-grid
      [dataCall]="dataRequest"
      [columnDefinitions]="[
        { field: "col1", name: "Column 1" },
        { field: "col2", name: "Column 2" },
      ]"
      [externalFiltering]="true"
      [externalSorting]="true"
      [externalPaging]="true"
      [pageSize]="10">
    </hci-grid>

And a function using mocked external data call.

    dataRequest(externalInfo: ExternalInfo): Promise<ExternalData> {
      return new Promise((resolve, reject) => {
        this.dataGeneratorService.getExternalData1(externalInfo).subscribe((externalData: ExternalData) => {
          setTimeout(() =>
            resolve(externalData), 1000
          );
        });
      });
    }

## Advanced Features

### Rendering Cells

Every refresh of data and every vertical scroll will re-render the visible rows and cells.  To speed things
up, each cell is limited to rendering pure HTML.  However, there are several options of how to render and
the option of custom rendering.

Every cell is rendering with a class that implements the CellViewRenderer interface.  The two methods
required to implement are

    setConfig(config: any);

    createElement(renderer: Renderer2, column: Column, value: any, i: number, j: number): HTMLElement;
    
As an example, the following is an example of a number range renderer.

    {
        field: "nLabs",
        name: "# Labs",
        viewRenderer: CellNumberRangeView,
        viewConfig: { low: 15, high: 85, showIcon: true }
    }

The class is passed in as the viewRenderer and any config is passed in through the viewConfig.

### Filtering

Like view rendering, built in and custom components can be used to render the filter.  The difference
is rather than pure HTML, a filter is a component that extends a base class FilterRenderer.  The
following are examples of built in filters.

    {
        field: "firstName",
        name: "First Name",
        filterRenderer: TextFilterRenderer
    },
    {
        field: "dob",
        name: "Date of Birth",
        dataType: "date",
        format: "MM/DD/YYYY",
        editRenderer: DateEditRenderer,
        filterRenderer: CompareFilterRenderer
    },
    {
        field: "gender",
        name: "Gender",
        editRenderer: ChoiceEditRenderer,
        choices: [ {value: "Female", display: "Female"}, {value: "Male", display: "Male"} ],
        filterRenderer: SelectFilterRenderer
    }
