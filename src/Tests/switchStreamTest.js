import { Selector } from 'testcafe';  
import XPathSelector from './xpath-selector';


fixture `Smoke test`
    .page `http://localhost:3000/silverstreaming#/home`;

test('switchStreamTest', async t => {
    await t
    
        .click('#TokenGeneratorButton')
        .setNativeDialogHandler(() => true)
        .click('#BroadcastButton')
        .wait(1000)
        const firstCheckbox  = XPathSelector('//*[@id="2"]/video');
       

        await t
        .click(firstCheckbox)
        .expect(Selector('#currentParticipantId').innerText).eql('2', 'string contains the expected substring')        
});