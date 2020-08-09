import { proxy, serve, ok } from '@fiorite/http';

serve(r => proxy('https://github.com/', r), 5000);
serve(() => ok('hello on 5001'), 5001);
