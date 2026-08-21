PS C:\Users\oskarwong\WebstormProjects\payloadcmsweb> pnpm payload migrate          
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.
[15:30:10] INFO: Reading migration files from C:\Users\oskarwong\WebstormProjects\payloadcmsweb\src\migrations
[15:30:10] INFO: Migrating: 20260821_072203_initial
[15:30:24] INFO: Migrated:  20260821_072203_initial (14077ms)
[15:30:24] INFO: Done.
PS C:\Users\oskarwong\WebstormProjects\payloadcmsweb> pnpm dev            
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> payload-website@1.0.4 dev C:\Users\oskarwong\WebstormProjects\payloadcmsweb
> cross-env NODE_OPTIONS=--no-deprecation next dev

▲ Next.js 15.4.10
- Local:        http://localhost:3000
- Network:      http://172.20.166.230:3000
- Environments: .env

✓ Starting...
✓ Ready in 9s
○ Compiling / ...
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\DumpStack.log.tmp'
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\hiberfil.sys'
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\swapfile.sys'
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\pagefile.sys'
✓ Compiled / in 19s (4171 modules)
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\DumpStack.log.tmp'
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\hiberfil.sys'
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\pagefile.sys'
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\swapfile.sys'
[✓] Pulling schema from database...
⨯ [TypeError: Cannot read properties of undefined (reading 'referencedTable')] {
digest: '2348351976'
}
GET / 500 in 38313ms