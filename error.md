[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.
C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\utilities\validateIdentifierLength.ts:11
throw new APIError(
^

APIError: Exceeded max identifier length for table or enum name of 63 characters. Invalid name: enum_case_studies_blocks_card_grid_card_grid_fields_links_link_type.
Tip: You can use the dbName property to reduce the table name length.

    at validateIdentifierLength (C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\utilities\validateIdentifierLength.ts:11:11)
    at createTableName (C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\createTableName.ts:80:10)
    at <anonymous> (C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\schema\traverseFields.ts:771:26)
    at Array.forEach (<anonymous>)
    at traverseFields (C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\schema\traverseFields.ts:121:10)
    at <anonymous> (C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\schema\traverseFields.ts:661:13)
    at Array.forEach (<anonymous>)
    at traverseFields (C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\schema\traverseFields.ts:121:10)
    at buildTable (C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\schema\build.ts:126:7)
    at <anonymous> (C:\Users\oskarwong\WebstormProjects\payloadcmsweb\node_modules\.pnpm\@payloadcms+drizzle@3.87.0_@libsql+client@0.14.0_@opentelemetry+api@1.9.0_payload@3.87.0_grap_n5xuj4xgfrxz77gdtqmvv6oxfm\node_modules\@payloadcms\drizzle\src\schema\traverseFields.ts:254:13) {
data: null,
isOperational: true,
isPublic: false,
status: 500,
[cause]: null
}

Node.js v24.16.0