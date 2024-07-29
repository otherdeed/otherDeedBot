import { log } from 'console';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
export async function getAttributes(contract,id) {
    const options = {
        method: 'GET',
        headers: {
            accept: '*/*',
            Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
        }
    };
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=${contract}&tokenName=${id}&sortBy=floorAskPrice&limit=20&includeTopBid=false&excludeEOA=false&includeAttributes=true&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    const data = await response.json()
    const dataAttributes = await data.tokens[0].token.attributes
    let Attributes = {
        sediment: {
            names: '',
            tier: 0
        },
        environment: {
            names: '',
            tier: 0
        },
        nResource: {
            names: '',
            tier: 0
        },
        sResource: {
            names: '',
            tier: 0
        },
        wResource: {
            names: '',
            tier: 0
        },
        eResource: {
            names: '',
            tier: 0
        },
        artifact: {
            names: ''
        },
        koda: false
    }

    function getEarthAttributes(type, objectKey) {
        const attributes = dataAttributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].key === type) {
                if (!Attributes[objectKey]) {
                    Attributes[objectKey] = {};
                }
                Attributes[objectKey].names = attributes[i].value;
                break;
            }
        }
    }
    getEarthAttributes('Sediment', 'sediment')
    getEarthAttributes('Environment', 'environment')
    getEarthAttributes('Northern Resource', 'nResource')
    getEarthAttributes('Southern Resource', 'sResource')
    getEarthAttributes('Western Resource', 'wResource')
    getEarthAttributes('Eastern Resource', 'eResource')
    getEarthAttributes('Artifact', 'artifact')

    function getEarthTier(type, objectKey) {
        const attributes = dataAttributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].key === type) {
                if (!Attributes[objectKey]) {
                    Attributes[objectKey] = {};
                }
                Attributes[objectKey].tier = attributes[i].value;
                break;
            }
        }
    }
    getEarthTier('Sediment Tier', 'sediment')
    getEarthTier('Environment Tier', 'environment')
    getEarthTier('Northern Resource Tier', 'nResource')
    getEarthTier('Southern Resource Tier', 'sResource')
    getEarthTier('Western Resource Tier', 'wResource')
    getEarthTier('Eastern Resource Tier', 'eResource')

    function getEarthKoda(type, objectKey) {
        const attributes = dataAttributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].key === type) {
                Attributes[objectKey] = true
                break;
            }
        }
    }
    getEarthKoda('Koda', 'koda')
    console.log(Attributes);
    return Attributes;
}
export async function getInfoEarth(contract,id) {
    try {
        const options = {
            method: 'GET',
            headers: {
                accept: '*/*',
                Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
            }
        };
        const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=${contract}&tokenName=${id}&sortBy=floorAskPrice&limit=1&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
        const data = await response.json()
        // console.log(data.tokens[0].token.tokenId)
        const Attributes = await getAttributes(id)
        const dataEarth = await data.tokens[0]
        const infoEarth = {
            id: dataEarth.token.tokenId,
            contract: dataEarth.token.contract,
            usdPrice: dataEarth.market.floorAsk && dataEarth.market.floorAsk.price && dataEarth.market.floorAsk.price.amount ? dataEarth.market.floorAsk.price.amount.usd.toFixed(2) : 'N/A',
            ethPrice: dataEarth.market.floorAsk && dataEarth.market.floorAsk.price && dataEarth.market.floorAsk.price.amount ? dataEarth.market.floorAsk.price.amount.native.toFixed(4) : 'N/A',
            image: dataEarth.token.imageLarge,
            sediment: Attributes.sediment.names,
            environment: Attributes.environment.names,
            sedimentTier: Attributes.sediment.tier,
            environmentTier: Attributes.environment.tier,
            nResource: Attributes.nResource.names,
            nResourceTier: Attributes.nResource.tier,
            sResource: Attributes.sResource.names,
            sResourceTier: Attributes.sResource.tier,
            wResource: Attributes.wResource.names,
            wResourceTier: Attributes.wResource.tier,
            eResource: Attributes.eResource.names,
            eResourceTier: Attributes.eResource.tier,
            artifact: Attributes.artifact.names,
            koda: Attributes.koda
        }
        console.log(infoEarth);
        return infoEarth
    } catch (erorr) {
        console.log(erorr);
    }
}

export async function filterEarthAttributes(contract,id) {
    let infoEarth = await getInfoEarth(contract,id)

    function deleteEmpty(objKey, objTierKey) {
        if (infoEarth[objKey] == '' || infoEarth[objTierKey] == false) {
            delete infoEarth[objTierKey];
            delete infoEarth[objKey];
        }
    }
    deleteEmpty('wResource', 'wResourceTier');
    deleteEmpty('eResource', 'eResourceTier');
    deleteEmpty('nResource', 'nResourceTier');
    deleteEmpty('sResource', 'sResourceTier');
    deleteEmpty('artifact', 'artifact');
    deleteEmpty('koda', 'koda');
    return infoEarth
}

export async function calculateRarity(contract,id) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let infoEarth = await filterEarthAttributes(contract,id);
    const filePath = path.resolve(__dirname, '../Attributes.json');
    const data = await fs.readFile(filePath, 'utf8');
    const attributes = JSON.parse(data);
    let EarthData = {};

    function getValue(key, keyValue, names) {
        if (attributes[key] && keyValue in attributes[key]) {
            EarthData[names] = attributes[key][keyValue];
        }
    }
    getValue('sediment', infoEarth['sediment'], 'sediment');
    getValue('environments', infoEarth['environment'], 'environment');
    getValue('resources', infoEarth['nResource'], 'nResource');
    getValue('resources', infoEarth['sResource'], 'sResource');
    getValue('resources', infoEarth['wResource'], 'wResource');
    getValue('resources', infoEarth['eResource'], 'eResource');
    getValue('artifacts', infoEarth['artifact'], 'artifact');

    function Rarity(attr, tier) {
        let rarityAttributes = 0
        if (EarthData.hasOwnProperty(attr) && typeof EarthData[attr].TotalAmount !== 'undefined') {
            const totalAmount = EarthData[attr].TotalAmount;
            const Tier = infoEarth[tier];
            const TierValue = EarthData[attr][Tier]
            rarityAttributes = (totalAmount - TierValue) / totalAmount;
        } else {
            rarityAttributes = 0
        }
        return rarityAttributes
    }

    Rarity('sediment', 'sedimentTier')
    const RaritySidement = Rarity('sediment', 'sedimentTier');
    const RarityEnvironment = Rarity('environment', 'environmentTier');
    const RarityNResource = Rarity('nResource', 'nResourceTier');
    const RaritySResource = Rarity('sResource', 'sResourceTier');
    const RarityWResource = Rarity('wResource', 'wResourceTier');
    const RarityEResource = Rarity('eResource', 'eResourceTier');
    const totalRarity = (RaritySidement + RarityEnvironment + RarityNResource + RaritySResource + RarityEResource + RarityWResource).toFixed(2);
    return totalRarity
}
export async function msgBotAttributes(contract,id) {
    let infoEarth = await filterEarthAttributes(contract,id);

    function msgBotDecor(objKey) {
        let inf = '';
        if (infoEarth[objKey] == 1) {
            inf = '1️⃣';
        } else if (infoEarth[objKey] == 2) {
            inf = '2️⃣';
        } else if (infoEarth[objKey] == 3) {
            inf = '3️⃣';
        } else if (infoEarth[objKey] == 4) {
            inf = '4️⃣';
        } else if (infoEarth[objKey] == 5) {
            inf = '5️⃣';
        } else if (infoEarth[objKey] === undefined || infoEarth[objKey] === '') {
            inf = '';
        }
        return inf;
    }

    function msgBotKoda(objKey) {
        let inf = '';
        if (infoEarth[objKey] == true) {
            inf = 'Koda😳';
        }
        return inf;
    }

    function msgBotArtifact(objKey) {
        if (objKey in infoEarth && infoEarth[objKey]) {
            return infoEarth[objKey];
        } else {
            return '🚫';
        }
    }
    let resources = [{
            key: 'eResource',
            tier: 'eResourceTier'
        },
        {
            key: 'sResource',
            tier: 'sResourceTier'
        },
        {
            key: 'wResource',
            tier: 'wResourceTier'
        },
        {
            key: 'nResource',
            tier: 'nResourceTier'
        }
    ];

    let resourceStr = resources.map(r => {
        return infoEarth[r.key] ? `${infoEarth[r.key]}${msgBotDecor(r.tier)}` : '';
    }).filter(Boolean).join(',');

    function checkMsgBotDecor() {
        if (resourceStr == '') {
            return `${msgBotKoda('koda')}\nSediment: ${infoEarth.sediment}${msgBotDecor('sedimentTier')}\nEnvironment: ${infoEarth.environment}${msgBotDecor('environmentTier')}\nResource: 🚫\nArtifact: ${msgBotArtifact('artifact')}`;
        }
        return `${msgBotKoda('koda')}\nSediment: ${infoEarth.sediment}${msgBotDecor('sedimentTier')}\nEnvironment: ${infoEarth.environment}${msgBotDecor('environmentTier')}\nResource: ${resourceStr}\nArtifact: ${msgBotArtifact('artifact')}`;
    }
    let mess = checkMsgBotDecor()
    return mess;
}
getInfoEarth('0x790b2cf29ed4f310bf7641f013c65d4560d28371','66050')
export async function conclusionRarity(contract,id) {
    const rarity = await calculateRarity(contract,id);
    const infoEarth = await filterEarthAttributes(contract,id);
    const minPrice = 0.141
    const Price = infoEarth.ethPrice;
    let differencePrice = Price / minPrice;
    let Rarity = rarity * differencePrice
    let k = (Price / Rarity).toFixed(3);
    if (infoEarth.artifact && infoEarth.artifact.length > 0) {
        return 'На данный момент бот не уммет считать редкость земли с Артефактом 😔';
    }
    if (infoEarth.koda == true) {
        return 'На данный момент бот не уммет считать редкость земли с Koda 😔';
    }
    if (k < 0.06) {
        return 'Эта цена ниже рыночной';
    } else if (k >= 0.06 && k < 0.09) {
        return 'Эта цена немного ниже рыночной';
    } else if (k >= 0.09 && k < 0.12) {
        return 'Эта цена соответствует рынку'
    } else if (k >= 0.12 && k < 0.18) {
        return 'Эта цена выше рынка';
    } else if (k >= 0.18) {
        return 'Эта цена сильно выше рынка'
    }
}
export async function getFloorPrice(contract) {
    const options = {
        method: 'GET',
        headers: {
            accept: '*/*',
            Authorization: '74937b04-9ea2-4c1e-a6cf-3702655b7934'
        }
    };
    const response = await fetch(`https://api-mainnet.magiceden.dev/v3/rtp/ethereum/tokens/v6?collection=${contract}&sortBy=floorAskPrice&limit=1&includeTopBid=false&excludeEOA=false&includeAttributes=True&includeQuantity=false&includeDynamicPricing=false&includeLastSale=false&normalizeRoyalties=false`, options)
    const data = await response.json()
    const floorId = data.tokens[0].token.tokenId
    return floorId
}


