import {directory} from '..';

(async () => {
    for await (const file of directory()) {
        file.name;
    }
})();
