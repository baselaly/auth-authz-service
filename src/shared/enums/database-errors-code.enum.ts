export enum DatabaseErrorCode {
  INVALID_DATA = 'P2003', // enter wrong forigen keys using create
  ENTRY_HAS_CHILD = 'P2014', // try to delete entry has childrens
  DATA_NOT_FOUND = 'P2016', // enter wrong forigen keys using connect or try to access unfound entry
  DUPLICATE_ENTRY = 'P2002', // enter duplicated entry
  TABLE_NOT_FOUND = 'P2021', // table not exist
  RECORD_FOR_OPERATION_NOT_FOUND = 'P2025', // record/relation not found
}
