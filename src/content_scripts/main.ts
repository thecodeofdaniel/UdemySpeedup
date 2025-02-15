// What's this?: Runs content scripts when page is loaded

import { applyPlaybackToNewVid, watchURLChanges } from './watch_and_reapply';
import { listener } from './listener';
import { shortcuts } from './shortcuts';

watchURLChanges();
applyPlaybackToNewVid(false);
listener();
shortcuts();
