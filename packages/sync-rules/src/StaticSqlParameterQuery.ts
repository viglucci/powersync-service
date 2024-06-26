import { SelectedColumn, SelectFromStatement } from 'pgsql-ast-parser';
import { ParameterMatchClause, SqliteJsonValue, StaticRowValueClause, SyncParameters } from './types.js';
import { SqlTools } from './sql_filters.js';
import { getBucketId, isJsonValue } from './utils.js';
import { SqlRuleError } from './errors.js';
import { checkUnsupportedFeatures, isClauseError } from './sql_support.js';

/**
 * Represents a bucket parameter query without any tables, e.g.:
 *
 *    SELECT token_parameters.user_id
 *    SELECT token_parameters.user_id as user_id WHERE token_parameters.is_admin
 */
export class StaticSqlParameterQuery {
  static fromSql(descriptor_name: string, sql: string, q: SelectFromStatement) {
    const query = new StaticSqlParameterQuery();

    query.errors.push(...checkUnsupportedFeatures(sql, q));

    const tools = new SqlTools({
      table: undefined,
      value_tables: ['token_parameters', 'user_parameters'],
      sql
    });
    const where = q.where;
    const filter = tools.compileWhereClause(where);

    const columns = q.columns ?? [];
    const bucket_parameters = columns.map((column) => tools.getOutputName(column));

    query.sql = sql;
    query.descriptor_name = descriptor_name;
    query.bucket_parameters = bucket_parameters;
    query.columns = columns;
    query.tools = tools;
    query.filter = filter;

    for (let column of columns) {
      const name = tools.getSpecificOutputName(column);
      const extractor = tools.compileStaticExtractor(column.expr);
      if (isClauseError(extractor)) {
        // Error logged already
        continue;
      }
      query.static_extractors[name] = extractor;
    }

    query.errors.push(...tools.errors);
    return query;
  }

  sql?: string;
  columns?: SelectedColumn[];
  static_extractors: Record<string, StaticRowValueClause> = {};
  descriptor_name?: string;
  /** _Output_ bucket parameters */
  bucket_parameters?: string[];
  id?: string;
  tools?: SqlTools;

  filter?: ParameterMatchClause;

  errors: SqlRuleError[] = [];

  getStaticBucketIds(parameters: SyncParameters): string[] {
    const tables = { token_parameters: parameters.token_parameters, user_parameters: parameters.user_parameters };
    const filtered = this.filter!.filter(tables);
    if (filtered.length == 0) {
      return [];
    }

    let result: Record<string, SqliteJsonValue> = {};
    for (let name of this.bucket_parameters!) {
      const value = this.static_extractors[name].evaluate(tables);
      if (isJsonValue(value)) {
        result[`bucket.${name}`] = value;
      } else {
        // Not valid.
        // Should we error instead?
        return [];
      }
    }

    return [getBucketId(this.descriptor_name!, this.bucket_parameters!, result)];
  }
}
