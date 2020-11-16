import { Selector } from 'testcafe';

fixture `Smoke test`
    .page `http://localhost:3000/silverstreaming#/home`;

test('leaveSession', async t => {
    await t
    
        .click('#TokenGeneratorButton')
        .setNativeDialogHandler(() => true)
        .click('#ViewerButton')
        .click('#leaveSessionButton')

        const tokenGenBut = Selector('#TokenGeneratorButton').exists;
        await t.expect(tokenGenBut).ok();
        
});