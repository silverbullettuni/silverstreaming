import { Selector } from 'testcafe';

fixture `Smoke test`
    .page `http://localhost:3000/silverstreaming#/home`;

test('checkViewer', async t => {
    await t
    
        .click('#TokenGeneratorButton')
        .setNativeDialogHandler(() => true)
        .click('#ViewerButton')

        const viewerVideo = Selector('#viewerVideo').exists;
        await t.expect(viewerVideo).ok();
        
});