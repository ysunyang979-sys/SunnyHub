const fs = require('fs');
const path = require('path');

const mangaDir = path.join(__dirname, '../manga');
const output = []; // 升级为数组格式，方便存储更多元数据

// 定义分类关键词（你可以根据需要在这里添加更多关键词）
const categories = [
    { name: "永劫无间", keywords: ["永劫", "沈妙", "顾清寒", "玉玲珑","妙笔生草","快感体验","妖刀姬","殷紫萍"] },
    { name: "死或生", keywords: ["DOA", "死或生", "维纳斯"] },
    { name: "穿越火线", keywords: ["穿越火线"] },
    { name: "王者荣耀", keywords: ["王者"] },
    { name: "逆转", keywords: ["逆转"] },
    { name: "合租女室友", keywords: ["合租"] },
    { name: "晨曦战队", keywords: ["晨曦战队"] },
    { name: "最终幻想", keywords: ["蒂法"] },
    { name: "流光", keywords: ["流光"] },
    { name: "其他", keywords: [] } // 默认分类
];

if (!fs.existsSync(mangaDir)) {
    console.error('找不到 manga 文件夹');
    process.exit(1);
}

const albums = fs.readdirSync(mangaDir);

albums.forEach(album => {
    const albumPath = path.join(mangaDir, album);
    if (fs.statSync(albumPath).isDirectory()) {
        const images = fs.readdirSync(albumPath)
            .filter(file => /\.(webp|jpg|png|jpeg)$/i.test(file))
            .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));
        
        if (images.length > 0) {
            // 自动匹配分类
            let categoryName = "其他";
            for (const cat of categories) {
                if (cat.keywords.some(k => album.includes(k))) {
                    categoryName = cat.name;
                    break;
                }
            }

            // 格式化路径
            const formattedImages = images.map(img => `manga/${album}/${img}`.replace(/\\/g, '/'));

            output.push({
                title: album,
                category: categoryName,
                cover: formattedImages[0], // 第一张图作为封面
                images: formattedImages
            });
        }
    }
});

fs.writeFileSync(path.join(__dirname, '../data.json'), JSON.stringify(output, null, 2));
console.log('✅ 升级版数据生成成功！已识别分类并提取封面。');
