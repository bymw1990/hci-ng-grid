# Huntsman Cancer Institute's Angular Grid Library

## [hci-ng-grid Demo on Github](https://huntsmancancerinstitute-risr.github.io/hci-ng-grid-demo)

## Intro
    This grid is designed to be a full featured grid that can handle nearly anything that complex data tables may
    be expected to support.  By default, the grid is simple and basic, but becomes full featured through
    configuration.

## Install

```
"dependencies": {
    "hci-ng-grid": "4.0.0-beta.1"
}
```
```
import {GridModule} from "hci-ng-grid";
```
```
@NgModule({
    imports: [
        GridModule.forRoot()
    ]
})
```

## Publishing

    Compiled code gets moved to the dist folder with a copy of the package.json.  Custom commands are required for
    packaging and publishing.  Use npmPack and npmPublish instead of the usual pack and publish.

## Basic Features

* **Sorting:** Change sorting by clicking on column header.
* **Filtering:** String, select, range filtering with the possibility for custom filters.
* **Paging:** Paging with various page sizes, first, last, previous and next.
* **Row Grouping:** Rows can be grouped by one or more columns.
* **External Data Call:** Callback to retrieve data from external source.
* **Custom Events:** Listeners can be added to work for specific events and custom actions can be taken.

## Usage

**Note,** there are so many features to this grid that not all are currently listed here.  See the demo for full examples.

The basic syntax for data provided by the implementing component.

    <hci-grid
      [data]="dataArray"
      [columns]="[
        { field: "col1", name: "Column 1" },
        { field: "col2", name: "Column 2" },
      ]">
    </hci-grid>

The basic syntax for an external data call.

    <hci-grid
      [dataCall]="dataRequest"
      [columns]="[
        { field: "col1", name: "Column 1" },
        { field: "col2", name: "Column 2" },
      ]"
      [externalFiltering]="true"
      [externalSorting]="true"
      [externalPaging]="true"
      [pageSize]="10">
    </hci-grid>

And a function using mocked external data call.

    dataRequest: (externalInfo: ExternalInfo) => {};

    ngOnInit() {
      this.dataRequest = (externalInfo: ExternalInfo) => {
        return Observable.of(new ExternalData(this.dataGeneratorService.getData(250), externalInfo)).delay(500);
      };
    }

## Inputs
```
data
type: Object[]
default: undefined
Provide the grid with an array of rows as objects.  Two way binding to this data.
```
```
dataCall
type: Function
default: undefined
A function that is called to retrieve data.  The function is passed filtering, sorting and paging info.
```
```
id
type: string
default: undefined
The html id for the grid and the id that can be used to get the grid from the global grid service.
```
```
config
type: any
default: {}
A json object that contains configuration options for the grid.
```
```
linkedGroups
type: string[]
default: undefined
The group names that this grid should be linked to.
```
```
configurable
type: boolean
default: false
Flag if the user should be allowed to modify the grid's configuration (e.g. what colums are visible and how big).
```
```
title
type: string
default: undefined
Shows this title in a title bar above the grid.
```
```
theme
type: string
default: "spreadsheet"
options: "spreadsheet", "report", or your own
The name of the theme to use.  
```
```
columns
type: Column[]
default: undefined
An array of column configuration objects.
```
```
fixedColumns
type: string[]
default: undefined
A list of column names that should be fixed to the left side of the grid.
```
```
groupBy
type: string[]
default: undefined
A list of column names that should be used to group rows together.
```
```
* Currently disabled *
groupByCollapsed
type: boolean
default: true
The state for grouped rows if those rows in a group should be hidden or shown by default.
```
```
externalFiltering
type: boolean
default: false
True if filtering should be handled by the external data call.
```
```
externalSorting
type: boolean
default: false
True if sorting should be handled by the external data call.
```
```
externalPaging
type: boolean
default: false
True if paging should be handled by the external data call.
```
```
pageSize
type: number
default: undefined
The number of rows per page.  If not specified it will show all of them.
```
```
pageSizes
type: number[]
default: [10, 25, 50]
An array of possible page sizes that the user can choose from.
```
```
nVisibleRows
type: number
default: -1
The number of visible rows.  A page might have 100 rows, but you can limit the size of the grid to 10 rows which would be scrolling for the user.  The default is -1 which is the same as the page size.
```
```
saveOnDirtyRowChange
type: boolean
default: false
If true, will emit a (onRowSave) event if you navigate to a new row and the previous row has dirty values.
```
```
busyTemplate
type: TemplateRef<any>
default: undefined
A custom template shown when data is loaded.  If you don't like the default spinner.
```
```
eventListeners
type: EventListenerArg[]
default: []
An array of listeners that can perform actions on any sort of click or key events.
```
```
mode
type: string
default: undefined
A shortcut for creating listeners.  Rather than passing in your own listeners, specify a mode and the required listeners will be created for you.
```
```
logWarnings
type: boolean
default: true
True if you want warnings to show in the console.
```
```
display
type: string
default: flow-root
Sets the display on the root component.  Although you could also do this with style on the grid.
```

## Outputs
```
onCellSave
type: any
$event: { key: rows[i].key,
          i: i,
          j: j,
          field: columns[j].field,
          oldValue: oldValue,
          newValue: newValue }
The row key, location, field, old and new value of the cell.
```
```
onRowSave
type: any
$event: { key: rows[i].key,
          rowNum: i,
          row: originalRowData }
Emits the key, row number and the data for the row in the format originally passed in.
```
```
onConfigChange
type: any
$event: config
Emits the current configuration for the grid.
```
```
cellClick
type: any
$event: any
Determined by the event listener which can emit any type of data.
```
```
cellDblClick
type: any
$event: any
Determined by the event listener which can emit any type of data.
```
```
rowClick
type: any
$event: any
Determined by the event listener which can emit any type of data.
```
```
rowDblClick
type: any
$event: any
Determined by the event listener which can emit any type of data.
```
```
warning
type: string
$event: warning message as a string
Listen to this to handle warnings from the grid as you wish (e.g. as a toast popup).
```
```
selectedRows
type: any[]
$event: [key1, key2, ...]
This is an array of any instead of number because the row key could be anything.
```
```
filterEvent
type: FilterInfo[]
$event: FilterInfo[]
This is the array of filters used when a column's filters are applied.  In the case of a select where there are multiple
FilterInfos, this includes the full list and not the one that changed.  This event is fired upon click.  It will take
some delay for data to come back at which point the filterEvent would be fired.
```
```
dataFiltered
type: any
$event: {type, status, nData}
This is emitted when a filter event returns data.  It will provide the number of rows returning.
```
```
sortEvent
type: SortInfo
$event: SortInfo
This is the sortInfo emitted when a column header is clicked.  It will take
some delay for data to come back at which point the sortEvent would be fired.
```
```
dataSorted
type: any
$event: {type, status, field}
This is emitted when a sort event returns data.  It will provide the field being sorted.
```

## Global Config

The root module can take configuration json that can be used to set defaults for every grid.
For example, if you want every grid in your application to use the same theme and you don't want
to specify that theme in every instance of the grid, you can do the following:

    GridModule.forRoot({
      theme: "report"
    })

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

## Known Issues

* Row Groups works upon load, but breaks when filtering is introduced.

## TODOs

* There are only left fixed colums, but some have requested right fixed columns.
