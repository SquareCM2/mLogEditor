import * as Blockly from 'blockly';

const blocksColor = {
	unit: 50, mblock: 10, ctrl: 120, operate: 270, draw: 165, memory: 255
}

// ---- 辅助块（变形器工作区中使用） ----
Blockly.Blocks['print_top'] = {
  init: function() {
    this.appendDummyInput().appendField('参数列表');
    this.appendStatementInput('STACK');
    this.setColour(blocksColor.draw);
    this.contextMenu = false;
  }
};

Blockly.Blocks['print_item'] = {
  init: function() {
    this.appendDummyInput().appendField('参数');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(blocksColor.draw);
    this.contextMenu = false;
  }
};

// ---- 注册变形器 ----
Blockly.Extensions.registerMutator(
  'print_mutator',
  {
    // 保存状态（JSON）
    saveExtraState: function() {
      return { itemCount: this.itemCount_ };
    },
    loadExtraState: function(state) {
      this.itemCount_ = state.itemCount || 1;
      this.updateShape_();
    },

    // 变形器界面：将主块分解为子块
    decompose: function(workspace) {
      const topBlock = workspace.newBlock('print_top');
      topBlock.initSvg();
      let connection = topBlock.getInput('STACK').connection;
      for (let i = 0; i < this.itemCount_; i++) {
        const itemBlock = workspace.newBlock('print_item');
        itemBlock.initSvg();
        connection.connect(itemBlock.previousConnection);
        connection = itemBlock.nextConnection;
      }
      return topBlock;
    },

    // 从变形器界面重建主块
    compose: function(topBlock) {
      let itemBlock = topBlock.getInputTargetBlock('STACK');
      const connections = [];
      while (itemBlock) {
        connections.push(itemBlock);
        itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      }

      // 保存当前子块
      const childBlocks = [];
      for (let i = 0; i < this.itemCount_; i++) {
        const input = this.getInput('ARG' + i);
        childBlocks.push(input && input.connection.targetBlock() || null);
      }

      // 移除旧输入
      for (let i = this.itemCount_ - 1; i >= 0; i--) {
        const input = this.getInput('ARG' + i);
        if (input) {
          if (input.connection.targetBlock()) input.connection.disconnect();
          this.removeInput('ARG' + i);
        }
      }

      this.itemCount_ = connections.length;
      this.updateShape_();

      // 恢复子块连接
      for (let i = 0; i < this.itemCount_; i++) {
        const input = this.getInput('ARG' + i);
        if (input && childBlocks[i]) {
          input.connection.connect(childBlocks[i].outputConnection);
        }
      }
    },

    // 保存连接关系
    saveConnections: function(topBlock) {
      let itemBlock = topBlock.getInputTargetBlock('STACK');
      let i = 0;
      while (itemBlock) {
        const input = this.getInput('ARG' + i);
        if (input) {
          const target = input.connection.targetBlock();
          if (target) {
            itemBlock.targetConnection = target.outputConnection;
          }
        }
        i++;
        itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
      }
    }
  },
  // 辅助初始化函数（块创建时执行）
  function() {
    this.itemCount_ = 1;
    this.updateShape_();
  },
  ['print_item']  // 变形器工作区允许的块类型
);

// 辅助函数：生成包含图标和文字的 HTML 元素
function createUnitOption(text, iconSrc) {
  const div = document.createElement('div');
  div.innerHTML = `<img src="${iconSrc}" style="width:24px;height:24px;vertical-align:middle;margin-right:8px;"> ${text}`;
  return div;
}

// 选项数据（直接从 JSON 复制）
const unitOptionsData = [
  ["尖刀", "res/units-ui/dagger.png", "dagger"],
  ["战锤", "res/units-ui/mace.png", "mace"],
  ["堡垒", "res/units-ui/fortress.png", "fortress"],
  ["权杖", "res/units-ui/scepter.png", "scepter"],
  ["王座", "res/units-ui/reign.png", "reign"],
  ["新星", "res/units-ui/nova.png", "nova"],
  ["恒星", "res/units-ui/pulsar.png", "pulsar"],
  ["耀星", "res/units-ui/quasar.png", "quasar"],
  ["灾星", "res/units-ui/vela.png", "vela"],
  ["死星", "res/units-ui/corvus.png", "corvus"],
  ["爬虫", "res/units-ui/crawler.png", "crawler"],
  ["毒蛛", "res/units-ui/atrax.png", "atrax"],
  ["血蛭", "res/units-ui/spiroct.png", "spiroct"],
  ["毒蛊", "res/units-ui/arkyid.png", "arkyid"],
  ["天蝎", "res/units-ui/toxopid.png", "toxopid"],
  ["星辉", "res/units-ui/flare.png", "flare"],
  ["天垠", "res/units-ui/horizon.png", "horizon"],
  ["苍穹", "res/units-ui/zenith.png", "zenith"],
  ["月影", "res/units-ui/antumbra.png", "antumbra"],
  ["日蚀", "res/units-ui/eclipse.png", "eclipse"],
  ["独影", "res/units-ui/mono.png", "mono"],
  ["幻型", "res/units-ui/poly.png", "poly"],
  ["巨像", "res/units-ui/mega.png", "mega"],
  ["雷霆", "res/units-ui/quad.png", "quad"],
  ["要塞", "res/units-ui/oct.png", "oct"],
  ["梭鱼", "res/units-ui/risso.png", "risso"],
  ["飞鲨", "res/units-ui/minke.png", "minke"],
  ["戟鲸", "res/units-ui/bryde.png", "bryde"],
  ["蛟龙", "res/units-ui/sei.png", "sei"],
  ["海神", "res/units-ui/omura.png", "omura"],
  ["潜螺", "res/units-ui/retusa.png", "retusa"],
  ["电鳗", "res/units-ui/oxynoe.png", "oxynoe"],
  ["江豚", "res/units-ui/cyerce.png", "cyerce"],
  ["玄武", "res/units-ui/aegires.png", "aegires"],
  ["龙王", "res/units-ui/navanax.png", "navanax"],
  ["阿尔法", "res/units-ui/alpha.png", "alpha"],
  ["贝塔", "res/units-ui/beta.png", "beta"],
  ["伽马", "res/units-ui/gamma.png", "gamma"]
];

const unitOptionsData_E = [
	["围护", "res/units-ui/stell.png", "stell"],
	["循迹", "res/units-ui/locus.png", "locus"],
	["准绳", "res/units-ui/precept.png", "precept"],
	["征服", "res/units-ui/vanquish.png", "vanquish"],
	["领主", "res/units-ui/conquer.png", "conquer"],
	["挣脱", "res/units-ui/elude.png", "elude"],
	["遮蔽", "res/units-ui/avert.png", "avert"],
	["消散", "res/units-ui/obviate.png", "obviate"],
	["遏止", "res/units-ui/quell.png", "quell"],
	["悲怆", "res/units-ui/disrupt.png", "disrupt"],
	["天守", "res/units-ui/merui.png", "merui"],
	["天赐", "res/units-ui/cleroi.png", "cleroi"],
	["天灾", "res/units-ui/anthicus.png", "anthicus"],
	["天理", "res/units-ui/tecta.png", "tecta"],
	["天帝", "res/units-ui/collaris.png", "collaris"],
	["苏醒", "res/units-ui/evoke.png", "evoke"],
	["策动", "res/units-ui/incite.png", "incite"],
	["发散", "res/units-ui/emanate.png", "emanate"]
]

Blockly.Blocks['S_Unit'] = {
  init: function() {
    // 将选项数据转换为 Blockly.FieldDropdown 所需的格式
    const options = unitOptionsData.map(([text, iconSrc, value]) => [
      createUnitOption(text, iconSrc),
      value
    ]);

    this.appendDummyInput()
        .appendField('塞普罗 ')
        .appendField(new Blockly.FieldDropdown(options), 'value');

    // 设置颜色和输出类型（与 JSON 中保持一致）
    this.setColour(blocksColor.unit);
    this.setOutput(true, 'UnitType');
  }
};

Blockly.Blocks['E_Unit'] = {
  init: function() {
    // 将选项数据转换为 Blockly.FieldDropdown 所需的格式
    const options = unitOptionsData_E.map(([text, iconSrc, value]) => [
      createUnitOption(text, iconSrc),
      value
    ]);

    this.appendDummyInput()
        .appendField('埃里克尔 ')
        .appendField(new Blockly.FieldDropdown(options), 'value');

    // 设置颜色和输出类型（与 JSON 中保持一致）
    this.setColour(blocksColor.unit);
    this.setOutput(true, 'UnitType');
  }
};

const itemOptionsData = [
	["铜", "res/items-ui/item-copper.png", "copper"],
	["铅", "res/items-ui/item-lead.png", "lead"],
	["煤炭", "res/items-ui/item-coal.png", "coal"],
	["沙子", "res/items-ui/item-sand.png", "sand"],
	["硅", "res/items-ui/item-silicon.png", "silicon"],
	["钢化玻璃", "res/items-ui/item-metaglass.png", "metaglass"],
	["钛", "res/items-ui/item-titanium.png", "titanium"],
	["石墨", "res/items-ui/item-graphite.png", "graphite"],
	["废料", "res/items-ui/item-scrap.png", "scrap"],
	["钍", "res/items-ui/item-thorium.png", "thorium"],
	["塑钢", "res/items-ui/item-plastanium.png", "plastanium"],
	["孢子荚", "res/items-ui/item-spore-pod.png", "spore-pod"],
	["硫", "res/items-ui/item-pyratite.png", "pyratite"],
	["爆炸混合物", "res/items-ui/item-blast-compound.png", "blastCompound"],
	["相位布", "res/items-ui/item-phase-fabric.png", "phaseFabric"],
	["巨浪合金", "res/items-ui/item-surge-alloy.png", "surgeAlloy"]
];

const itemOptionsData_E = [
	["铍", "res/items-ui/item-beryllium.png", "beryllium"],
	["钨", "res/items-ui/item-tungsten.png", "tungsten"],
	["氧化物", "res/items-ui/item-oxide.png", "oxide"],
	["碳化物", "res/items-ui/item-carbide.png", "carbide"],
	["石墨", "res/items-ui/item-graphite.png", "graphite"],
	["沙子", "res/items-ui/item-sand.png", "sand"],
	["钍", "res/items-ui/item-thorium.png", "thorium"],
	["硅", "res/items-ui/item-silicon.png", "silicon"],
	["相位布", "res/items-ui/item-phase-fabric.png", "phaseFabric"],
	["巨浪合金", "res/items-ui/item-surge-alloy.png", "surgeAlloy"],
	["裂变产物", "res/items-ui/item-fissile-matter.png", "fissileMatter"],
	["休眠囊肿", "res/items-ui/item-dormant-cyst.png", "dormantCyst"],
];

Blockly.Blocks['S_Item'] = {
  init: function() {
    // 将选项数据转换为 Blockly.FieldDropdown 所需的格式
    const options = itemOptionsData.map(([text, iconSrc, value]) => [
      createUnitOption(text, iconSrc),
      value
    ]);

    this.appendDummyInput()
        .appendField('塞普罗 ')
        .appendField(new Blockly.FieldDropdown(options), 'value');

    // 设置颜色和输出类型（与 JSON 中保持一致）
    this.setColour(blocksColor.operate);
    this.setOutput(true, 'item');
  }
};

Blockly.Blocks['E_Item'] = {
  init: function() {
    // 将选项数据转换为 Blockly.FieldDropdown 所需的格式
    const options = itemOptionsData_E.map(([text, iconSrc, value]) => [
      createUnitOption(text, iconSrc),
      value
    ]);

    this.appendDummyInput()
        .appendField('埃里克尔 ')
        .appendField(new Blockly.FieldDropdown(options), 'value');

    // 设置颜色和输出类型（与 JSON 中保持一致）
    this.setColour(blocksColor.operate);
    this.setOutput(true, 'item');
  }
};

Blockly.defineBlocksWithJsonArray([
	{
		"type":"logic_compareX",
		"message0": "%1 %2 %3",
		"args0": [
			{
				"type": "input_value",
				"name": "A",
				"check": "Number"
			},
			{
				"type": "field_dropdown",
				"name": "OP",
				"options": [
					["=", "EQ", "%{BKY_LOGIC_COMPARE_EQ_ARIA}"],
					["\u2260", "NEQ", "%{BKY_LOGIC_COMPARE_NEQ_ARIA}"],
					["\u200f<", "LT", "%{BKY_LOGIC_COMPARE_LT_ARIA}"],
					["\u200f\u2264", "LTE", "%{BKY_LOGIC_COMPARE_LTE_ARIA}"],
					["\u200f>", "GT", "%{BKY_LOGIC_COMPARE_GT_ARIA}"],
					["\u200f\u2265", "GTE", "%{BKY_LOGIC_COMPARE_GTE_ARIA}"],
					["===", "STRICT_EQ", "严格等于"],
				]
			},
			{
			
				"type": "input_value",
				"name": "B",
				"check": "Number"
			}
		],
		"inputsInline":!0,
		"colour": 210,
		"output": "Boolean"
	},
	{
		type: "math_single",
		message0: "%1 %2",
		args0: [{
			type: "field_dropdown",
			name: "OP",
			options: [
				["%{BKY_MATH_SINGLE_OP_ROOT}", "ROOT"],
				["%{BKY_MATH_SINGLE_OP_ABSOLUTE}", "ABS",
					"%{BKY_MATH_SINGLE_OP_ABSOLUTE_ARIA}"
				],
				["-", "NEG", "%{BKY_MATH_SINGLE_OP_NEG_ARIA}"],
				["ln", "LN", "%{BKY_MATH_SINGLE_OP_LN_ARIA}"],
				["log10", "LOG10", "%{BKY_MATH_SINGLE_OP_LOG10_ARIA}"],
				["10^", "POW10", "%{BKY_MATH_SINGLE_OP_POW10_ARIA}"]
			]
		}, {
			type: "input_value",
			name: "NUM",
			check: "Number",
			ariaLabelText: "%{BKY_INPUT_LABEL_NUMBER}"
		}],
		output: "Number",
		style: "math_blocks",
		helpUrl: "%{BKY_MATH_SINGLE_HELPURL}",
		extensions: ["math_op_tooltip"]
	},
	{
		"type": "stopScript",
		"message0": "停止运行脚本",
		"colour": blocksColor.ctrl,
		"previousStatement": null
	},
	{
		"type": "endScript",
		"message0": "结束并重启脚本",
		"colour": blocksColor.ctrl,
		"previousStatement": null
	},
	{
		"type": "jump",
		"message0": "如果%1跳转到语句%2",
		"args0": [
			{
				"type": "input_value",
				"name": "if",
				"check": "Boolean"
			},
			{
				"type": "input_value",
				"name": "num",
				"check": "Number"
			}
		],
		"colour": blocksColor.ctrl,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "wait",
		"message0": "等待 %1 秒",
		"args0": [
			{
				"type": "input_value",
				"name": "sec",
				"check": "Number"
			}
		],
		"colour": blocksColor.ctrl,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type":"math_bit",
		"message0": "%1%3%2",
		"args0": [
			{
				"type": "input_value",
				"name": "A",
				"check": "Number"
			},
			{
			
				"type": "input_value",
				"name": "B",
				"check": "Number"
			},
			{
				"type": "field_dropdown",
				"name": "OP",
				"options":[
					["按位与", "bAnd"],
					["按位或", "bOr"],
					["按位异或", "bXor"],
					["<<", "SHL"],
					[">>", "SHR"]
				]
			}
		],
		"inputsInline":!0,
		"colour": 230,
		"output": "Number"
	},
	{
		"type":"math_bitS",
		"message0": "%1 按位取反",
		"args0": [
			{
				"type": "input_value",
				"name": "A",
				"check": "Number"
			}
		],
		"inputsInline":!0,
		"colour": 230,
		"output": "Number"
	},
	{
		"type":"math_singleX",
		"message0": "%1%2",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "OP",
				"options":[
					["向上取整", "ceil"],
					["向下取整", "floor"],
				]
			},
			{
				"type": "input_value",
				"name": "X",
				"check": "Number"
			}
		],
		"colour": 230,
		"output": "Number"
	},
	{
		"type":"math_rand",
		"message0": "0到%1间随机浮点数",
		"args0": [
			{
				"type": "input_value",
				"name": "X",
				"check": "Number"
			}
		],
		"inputsInline":!0,
		"colour": 230,
		"output": "Number"
	},
	{
		"type": "math_m",
		"message0": "%2 与 %3 中的 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "OP",
				"options":[
					["最大值", "max"],
					["最小值", "min"]
				]
			},
			{
				"type": "input_value",
				"name": "A",
				"check": "Number"
			},
			{
				"type": "input_value",
				"name": "B",
				"check": "Number"
			}
		],
		"colour": 230,
		"output": "Number"
	},
	//I/O
	{
	    "type": "printToFlush",
	    "mutator": "print_mutator",   // 关联变形器
	    "message0": "输出至缓冲区:",
	    "colour": blocksColor.draw,
	    "previousStatement": null,
	    "nextStatement": null,
		"inputsInline": true,
	},
	{
	    "type": "printFlush",
	    "message0": "输出缓冲区至信息板 %1",
		"args0": [
			{
				"type": "input_value",
				"name": "MEMORY",
				"check": ["variables_get", "Block"],
			},
		],
	    "colour": blocksColor.draw,
	    "previousStatement": null,
	    "nextStatement": null,
		"inputsInline": true,
	},
	//draw
	{
	    "type": "drawFlush",
	    "message0": "输出缓冲区至显示屏 %1",
		"args0": [
			{
				"type": "input_value",
				"name": "DISPLAY",
				"check": ["variables_get", "Block"],
			},
		],
	    "colour": blocksColor.draw,
	    "previousStatement": null,
	    "nextStatement": null,
		"inputsInline": true,
	},
	{
		"type": "mblock_S",
		"message0": "塞普罗 %1",
		    "args0": [
		        {
		            "type": "field_dropdown",
		            "name": "value",
		            "options": [
		                ["铜墙", "copperWall"],
		                ["大型铜墙", "copperWallLarge"],
		                ["钛墙", "titaniumWall"],
		                ["大型钛墙", "titaniumWallLarge"],
		                ["塑钢墙", "plastaniumWall"],
		                ["大型塑钢墙", "plastaniumWallLarge"],
		                ["相织布墙", "phaseWall"],
		                ["大型相织布墙", "phaseWallLarge"],
		                ["钍墙", "thoriumWall"],
		                ["大型钍墙", "thoriumWallLarge"],
		                ["门", "door"],
		                ["大门", "doorLarge"],
		                ["双管", "duo"],
		                ["火焰", "scorch"],
		                ["分裂", "scatter"],
		                ["冰雹", "hail"],
		                ["蓝瑟", "lancer"],
		                ["传送带(灰带)", "conveyor"],
		                ["钛传送带(蓝带)", "titaniumConveyor"],
		                ["塑钢传送带", "plastaniumConveyor"],
		                ["装甲传送带(紫带)", "armoredConveyor"],
		                ["交叉器", "junction"],
		                ["路由器", "router"],
		                ["分配器", "distributor"],
		                ["分类器", "sorter"],
		                ["反向分类器", "invertedSorter"],
		                ["信息板", "message"],
		                ["强化信息板", "reinforcedMessage"],
		                ["世界信息板", "worldMessage"],
		                ["照明器", "illuminator"],
		                ["溢流门", "overflowGate"],
		                ["反向溢流门", "underflowGate"],
		                ["硅冶炼厂", "siliconSmelter"],
		                ["相织布编织器", "phaseWeaver"],
		                ["粉碎机", "pulverizer"],
		                ["冷冻液混合器", "cryofluidMixer"],
		                ["熔炉", "melter"],
		                ["焚化炉", "incinerator"],
		                ["孢子压缩机", "sporePress"],
		                ["分离机", "separator"],
		                ["煤炭离心机", "coalCentrifuge"],
		                ["电力节点", "powerNode"],
		                ["大型电力节点", "powerNodeLarge"],
		                ["巨浪电力塔", "surgeTower"],
		                ["二极管", "diode"],
		                ["电池", "battery"],
		                ["大型电池", "batteryLarge"],
		                ["火力发电机", "combustionGenerator"],
		                ["涡轮发电机", "steamGenerator"],
		                ["温差发电机", "differentialGenerator"],
		                ["冲击反应堆", "impactReactor"],
		                ["机械钻头", "mechanicalDrill"],
		                ["气动钻头", "pneumaticDrill"],
		                ["激光钻头", "laserDrill"],
		                ["抽水机", "waterExtractor"],
		                ["培养机", "cultivator"],
		                ["导管", "conduit"],
		                ["机械泵", "mechanicalPump"],   // 原为 "mechanical"，已替换
		                ["物品源", "itemSource"],
		                ["物品黑洞", "itemVoid"],
		                ["流体源", "liquidSource"],
		                ["流体黑洞", "liquidVoid"],
		                ["电力源", "powerSource"],
		                ["电力黑洞", "powerVoid"],
		                ["装卸器", "unloader"],
		                ["仓库", "vault"],
		                ["波浪", "wave"],
		                ["海啸", "tsunami"],
		                ["蜂群", "swarmer"],
		                ["齐射", "salvo"],
		                ["浪涌", "ripple"],
		                ["相织布传送带桥", "phaseConveyor"],
		                ["传送带桥", "bridgeConveyor"],
		                ["塑钢压缩机", "plastaniumCompressor"],
		                ["硫化物混合器", "pyratiteMixer"],
		                ["爆炸物混合器", "blastMixer"],
		                ["太阳能板", "solarPanel"],
		                ["大型太阳能板", "solarPanelLarge"],
		                ["石油钻井", "oilExtractor"],
		                ["维修点", "repairPoint"],
		                ["维修塔", "repairTurret"],
		                ["脉冲导管", "pulseConduit"],
		                ["电镀导管", "platedConduit"],
		                ["相织布导管桥", "phaseConduit"],
		                ["流体路由器", "liquidRouter"],
		                ["流体储罐", "liquidTank"],
		                ["流体容器", "liquidContainer"],
		                ["流体交叉器", "liquidJunction"],
		                ["导管桥", "bridgeConduit"],
		                ["回转泵", "rotaryPump"],
		                ["钍反应堆", "thoriumReactor"],
		                ["质量驱动器", "massDriver"],
		                ["爆破钻头", "blastDrill"],
		                ["脉冲泵", "impulsePump"],
		                ["热能发电机", "thermalGenerator"],
		                ["合金冶炼厂", "surgeSmelter"],
		                ["修理器", "mender"],
		                ["墙", "mendProjector"],
		                ["修理投影", "surgeWall"],
		                ["合金墙", "surgeWallLarge"],
		                ["大型合金墙", "cyclone"],
		                ["气旋", "fuse"],
		                ["雷光", "shockMine"],
		                ["脉冲地雷", "overdriveProjector"],
		                ["超速投影", "forceProjector"],
		                ["力墙投影", "arc"],
		                ["电弧", "rtgGenerator"],
		                ["幽灵", "spectre"],
		                ["融毁", "meltdown"],
		                ["厄兆", "foreshadow"],
		                ["容器", "container"],
		                ["发射台（旧）", "launchPad"],
						["发射台", "advancedLaunchPad"],
						["接收台", "landingPad"],
						["行星际加速器", "interplanetaryAccelerator"],
		                ["裂解", "segment"],
		                ["陆军工厂", "groundFactory"],
		                ["空军工厂", "airFactory"],
		                ["海军工厂", "navalFactory"],
		                ["数增级单位重构工厂", "additiveReconstructor"],
		                ["倍乘级单位重构工厂", "multiplicativeReconstructor"],
		                ["多幂级单位重构工厂", "exponentialReconstructor"],
		                ["无量级单位重构工厂", "tetrativeReconstructor"],
		                ["载荷传送带", "payloadConveyor"],
		                ["载荷路由器", "payloadRouter"],
		                ["开关", "switch"],
		                ["微型处理器", "microProcessor"],
		                ["逻辑处理器", "logicProcessor"],
		                ["超核处理器", "hyperProcessor"],
		                ["世界处理器", "worldProcessor"],
		                ["逻辑显示屏", "logicDisplay"],
		                ["大型逻辑显示屏", "largeLogicDisplay"],
		                ["内存元", "memoryCell"],
		                ["内存库", "memoryBank"],
		                ["世界内存元", "worldCell"]
		            ]
		        }
		    ],
		"colour":blocksColor.mblock,
		"output": "BlockType" 
	},
	{
		"type": "mblock_E",
		"message0": "埃里克尔 %1",
		    "args0": [
		        {
		            "type": "field_dropdown",
		            "name": "value",
		            "options": [
		                ["电弧硅炉", "siliconArcFurnace"],
		                ["电解机", "electrolyzer"],
		                ["大气收集器", "atmosphericConcentrator"],
		                ["氧化室", "oxidationChamber"],
		                ["电制热机", "electricHeater"],
		                ["矿渣制热机", "slagHeater"],
		                ["相织制热机", "phaseHeater"],
		                ["热量传输机", "heatRedirector"],
		                ["小型热量传输机", "smallHeatRedirector"],
		                ["热量路由器", "heatRouter"],
		                ["矿渣焚化炉", "slagIncinerator"],
		                ["碳化物坩埚", "carbideCrucible"],
		                ["矿渣离心机", "slagCentrifuge"],
		                ["合金坩埚", "surgeCrucible"],
		                ["氰合成机", "cyanogenSynthesizer"],
		                ["相织布合成机", "phaseSynthesizer"],
		                ["热量反应堆", "heatReactor"],
		                ["铍墙", "berylliumWall"],
		                ["大型铍墙", "berylliumWallLarge"],
		                ["钨墙", "tungstenWall"],
		                ["大型钨墙", "tungstenWallLarge"],
		                ["防爆闸门", "blastDoor"],
		                ["碳化物墙", "carbideWall"],
		                ["大型碳化物墙", "carbideWallLarge"],
		                ["强化合金墙", "reinforcedSurgeWall"],
		                ["大型强化合金墙", "reinforcedSurgeWallLarge"],
		                ["盾墙", "shieldedWall"],
		                ["雷达", "radar"],
		                ["建造塔", "buildTower"],
		                ["再生投影器", "regenProjector"],
		                ["震爆塔", "shockwaveTower"],
		                ["护盾投影器", "shieldProjector"],
		                ["大型护盾投影器", "largeShieldProjector"],
		                ["装甲管道", "armoredDuct"],
		                ["溢流管道", "overflowDuct"],
		                ["反向溢流管", "underflowDuct"],
		                ["管道装卸器", "ductUnloader"],
		                ["合金传送带", "surgeConveyor"],
		                ["合金路由器", "surgeRouter"],
		                ["单位物流装载器", "unitCargoLoader"],
		                ["单位物流卸载点", "unitCargoUnloadPoint"],
		                ["强化泵", "reinforcedPump"],
		                ["强化导管", "reinforcedConduit"],
		                ["强化流体交叉器", "reinforcedLiquidJunction"],
		                ["强化流体带桥", "reinforcedBridgeConduit"],
		                ["强化流体路由器", "reinforcedLiquidRouter"],
		                ["强化流体容器", "reinforcedLiquidContainer"],
		                ["强化流体储罐", "reinforcedLiquidTank"],
		                ["激光节点", "beamNode"],
		                ["激光塔", "beamTower"],
		                ["激光连接器", "beamLink"],
		                ["涡轮冷凝器", "turbineCondenser"],
		                ["化学燃烧室", "chemicalCombustionChamber"],
		                ["热解发生器", "pyrolysisGenerator"],
		                ["排气冷凝器", "ventCondenser"],
		                ["墙壁粉碎机", "cliffCrusher"],
		                ["高级墙壁粉碎机", "largeCliffCrusher"],
		                ["等离子钻机", "plasmaBore"],
		                ["高级等离子钻机", "largePlasmaBore"],
		                ["冲击钻头", "impactDrill"],
		                ["爆裂钻头", "eruptionDrill"],
		                ["城堡核心", "coreBastion"],
		                ["堡垒核心", "coreCitadel"],
		                ["卫城核心", "coreAcropolis"],
		                ["强化容器", "reinforcedContainer"],
		                ["强化仓库", "reinforcedVault"],
		                ["撕裂", "breach"],
		                ["升华", "sublimate"],
		                ["泰坦", "titan"],
		                ["驱离", "disperse"],
		                ["劫难", "afflict"],
		                ["光辉", "lustre"],
		                ["创伤", "scathe"],
		                ["坦克重构厂", "tankRefabricator"],
		                ["机甲重构厂", "mechRefabricator"],
		                ["飞船重构厂", "shipRefabricator"],
		                ["坦克组装厂", "tankAssembler"],
		                ["飞船组装厂", "shipAssembler"],
		                ["机甲组装厂", "mechAssembler"],
		                ["强化载荷传送带", "reinforcedPayloadConveyor"],
		                ["强化载荷路由器", "reinforcedPayloadRouter"],
		                ["载荷质量驱动器", "payloadMassDriver"],
		                ["解构器", "smallDeconstructor"],
		                ["画板", "canvas"],
		                ["大型画板", "largeCanvas"],
		                ["世界处理器", "worldProcessor"],
		                ["世界内存元", "worldCell"],
		                ["坦克制造厂", "tankFabricator"],
		                ["机甲制造厂", "mechFabricator"],
		                ["飞船制造厂", "shipFabricator"],
		                ["高级再重构工厂", "primeRefabricator"],
		                ["单位维修塔", "unitRepairTower"],
		                ["扩散", "diffuse"],
		                ["基本装配厂模块", "basicAssemblerModule"],
		                ["天谴", "smite"],
		                ["魔灵", "malign"],
		                ["通量反应堆", "fluxReactor"],
		                ["瘤变反应堆", "neoplasiaReactor"]
		            ]
		        }
		    ],
		"colour":blocksColor.mblock,
		"output": "BlockType" 
	},
	{
		"type": "mblock_input",
		"message0": "方块data @ %1",
		"args0":[
			{
				"type": "field_input",
				"name": "Type",
				"check": "String"
			}
		],
		"colour": blocksColor.mblock,
		"output": "BlockType"
	},
	{
		"type": "mblock_link",
		"message0": "获取绑定编号为 Link#%1 的方块",
		"args0": [
			{
				"type": "field_input",
				"name": "ID",
				"check": "Number",
			},
		],
		"colour": blocksColor.operate,
		"output": "Block"
	},
	{
		"type": "getBuilding",
		"message0": "获取绑定名称为 %1 的方块",
		"args0": [
			{
				"type": "field_input",
				"name": "ID",
				"check": "String",
			},
		],
		"colour": blocksColor.operate,
		"output": "Block"
	},
	{
		"type": "mblockProperties",
		"message0": "%1的%2",
		"args0":[
			{
				"type": "input_value",
				"name": "block",
				"check": ["variables_get", "Block"]
			},
			{
				"type": "field_dropdown",
				"name": "value",
				"options": [
					["x 坐标", "x"],
					["y 坐标", "y"],
					["物品总量", "totalItems"],
					["流体总量", "totalLiquids"],
					["电力总量", "totalPower"],
					["物品容量", "itemCapacity"],
					["流体容量", "liquidCapacity"],
					["电力容量", "powerCapacity"],
					["电网电量", "powerNetSrored"],
					["电网输入", "powerNetIn"],
					["电网输出", "powerNetOut"],
					["生命值", "health"],
					["热量（钍反）", "heat"],
					["效率", "efficieney"],
					["射击点 x 坐标", "shootX"],
					["射击点 y 坐标", "shootY"],
					["单位装载的物品种类", "firstItem"],
					["弹药总量", "ammo"],
					["弹药容量", "ammoCapacity"],
					["采矿点 x 坐标", "minex"],
					["采矿点 y 坐标", "miney"],
					["队伍", "team"],
					["类型", "type"],
					["配置值", "config"],
				]
			}
		],
		"colour": blocksColor.operate,
		"output": ["Number", "properties"]
	},
	{
		"type": "VarsThis",
		"message0": "当前处理器",
		"colour": blocksColor.operate,
		"output": "Block"
	},
	{
		"type": "ProcessorProp",
		"message0": "%1",
		"args0":[
			{
				"type": "field_dropdown",
				"name": "VALUE",
				"options": [
					["处理器的 x 坐标", "thisx"],
					["处理器的 y 坐标", "thisy"],
					["地图宽度", "mapw"],
					["地图高度", "maph"],
					["所链接的建筑数", "links"],
					["每秒执行的指令数", "ipt"],
					["存在的物品总数", "ItemCount"],
					["存在的液体总数", "liquidCount"],
					["存在的单位总数", "unitCount"],
					["存在的建筑总数", "blockCount"],
					["所经过的游戏刻(tick)", "tick"],
					["UNIX时间戳(ms)", "time"],
					["所经过的秒数", "second"],
					["所经过的分钟数", "minute"],
					["当前波次", "waveNumber"],
					["距下一波到来的秒数", "waveTime"],
				]
			}
		],
		"colour": blocksColor.operate,
		"output": ["Number", "properties"]
	},
	{
		"type": "mblockProperties2",
		"message0": "%1中%2的数量",
		"args0":[
			{
				"type": "input_value",
				"name": "block",
				"check": null
			},
			{
				"type": "input_value",
				"name": "value",
				"check": "item"
			}
		],
		"colour": blocksColor.operate,
		"output": ["Number", "properties"]
	},
	// {
	// 	"type": "S_Item",
	// 	"message0": "塞普罗物品 %1",
	// 	"args0": [
	// 		{
	// 			"type": "field_dropdown",
	// 			"name": "value",
	// 			"options": [
	// 				["铜", "copper"],
	// 				["铅", "lead"],
	// 				["煤炭", "coal"],
	// 				["沙子", "sand"],
	// 				["硅", "silicon"],
	// 				["钢化玻璃", "metaglass"],
	// 				["钛", "titanium"],
	// 				["石墨", "graphite"],
	// 				["废料", "scrap"],
	// 				["钍", "thorium"],
	// 				["塑钢", "plastanium"],
	// 				["孢子荚", "sporePod"],
	// 				["硫", "pyratite"],
	// 				["爆炸混合物", "blastCompound"],
	// 				["相位布", "phase-fabric"],
	// 				["巨浪合金", "surge-alloy"]
	// 			]
	// 		}
	// 	],
	// 	"colour": blocksColor.operate,
	// 	"output": "item"
	// },
	{
		"type": "S_Liquid",
		"message0": "塞普罗流体 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "value",
				"options": [
					["水", "water"],
					["矿渣液", "slag"],
					["石油", "oil"],
					["冷冻液", "cryofluid"]
				]
			}
		],
		"colour": blocksColor.operate,
		"output": "item"
	},
	{
		"type": "E_Liquid",
		"message0": "埃里克尔流体 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "value",
				"options": [
					["水", "water"],
					["矿渣液", "slag"],
					["瘤液", "neoplasm"],
					["芳油", "arkycite"],
					["臭氧", "ozone"],
					["氢气", "hydrogen"],
					["氮气", "nitrogen"],
					["氰气", "cyanogen"]
				]
			}
		],
		"colour": blocksColor.operate,
		"output": "item"
	},
	{
		"type": "Iteminput",
		"message0": "物品data @ %1",
		"args0": [
			{
				"type": "field_INPUT",
				"name": "value"
			}
		],
		"colour": blocksColor.operate,
		"output": "item"
	},

	{
		"type": "BlockRadar",
		"message0": "以建筑%1为中心寻找%2、%3且%4单位，并取以%5为依据排序后的%6",
		"args0": [
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": "variables_get",
			},
			{
				"type": "field_dropdown",
				"name": "FLITER_1",
				"options": [
					["任意的", "any"],
					["为敌方的", "enemy"],
					["为友方的", "ally"],
					["为玩家的", "player"],
					["攻击性的", "attacker"],
					["在空中的", "flying"],
					["是BOSS", "boss"],
					["在地面的", "ground"],
				]
			},
			{
				"type": "field_dropdown",
				"name": "FLITER_2",
				"options": [
					["任意的", "any"],
					["为敌方的", "enemy"],
					["为友方的", "ally"],
					["为玩家的", "player"],
					["攻击性的", "attacker"],
					["在空中的", "flying"],
					["是BOSS", "boss"],
					["在地面的", "ground"],
				]
			},
			{
				"type": "field_dropdown",
				"name": "FLITER_3",
				"options": [
					["任意的", "any"],
					["为敌方的", "enemy"],
					["为友方的", "ally"],
					["为玩家控制的", "player"],
					["攻击性的", "attacker"],
					["在空中的", "flying"],
					["是BOSS", "boss"],
					["在地面的", "ground"],
				]
			},
			{
				"type": "field_dropdown",
				"name": "SORT",
				"options": [
					["距离的负值", "distance"],
					["血量", "health"],
					["盾量", "shield"],
					["护甲值", "armor"],
					["血量上限", "maxHealth"]
				]
			},
			{
				"type": "field_dropdown",
				"name": "ORDER",
				"options": [
					["最大值", "true"],
					["最小值", "false"],
				]
			}
		],
		"colour": blocksColor.mblock,
		"output": "Unit"
	},
	{
		"type": "ControlEnabled",
		"message0": "使建筑 %1 被 %2",
		"args0": [
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": ["variables_get", "Block"],
			},
			{
				"type": "field_dropdown",
				"name": "ENABLED",
				"options": [
					["启用", "true"],
					["禁用", "false"],
				]
			}
		],
		"colour": blocksColor.mblock,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "ControlShoot",
		"message0": "令建筑 %4 向坐标 x %2 y %3 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "MODE",
				"options": [
					["射击", "true"],
					["瞄准", "false"]
				]
			},
			{
				"type": "input_value",
				"name": "X",
				"check": "Number"
			},
			{
				"type": "input_value",
				"name": "Y",
				"check": "Number"
			},
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": ["variables_get", "Block"],
			},
		],
		"colour": blocksColor.mblock,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "ControlShootp",
		"message0": "令建筑 %3 向单位 %2 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "MODE",
				"options": [
					["预瞄并射击", "true"],
					["预瞄", "false"]
				]
			},
			{
				"type": "input_value",
				"name": "UNIT",
				"check": ["variables_get", "Unit"],
			},
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": ["variables_get", "Block"],
			},
		],
		"colour": blocksColor.mblock,
		"nextStatement": null,
		"previousStatement": null
	},
	
	{
		"type": "ControlConfig",
		"message0": "设置建筑 %2 的配置继承自 %1",
		"args0": [
			{
				"type": "input_value",
				"name": "CONF",
				"check": ["Block", "item"]
			},
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": ["variables_get", "Block"],
			},
		],
		"colour": blocksColor.mblock,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	
	{
		"type": "Unit_input",
		"message0": "单位data @ %1",
		"args0":[
			{
				"type": "field_input",
				"name": "Type",
				"check": "String"
			}
		],
		"colour": blocksColor.unit,
		"output": "UnitType"
	},
	{
		"type": "Ubind",
		"message0": "绑定单位 %1",
		"args0": [
			{
				"type": "input_value",
				"name": "UNIT",
				"check": "UnitType"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	// {
	// 	"type": "S_Unit",
	// 	"message0": "塞普罗 %1",
	// 	"args0": [
	// 		{
	// 			"type": "field_dropdown",
	// 			"name": "value",
	// 			"options": [
	// 			    ["加载中...", "PLACEHOLDER"]
	// 			]
	// 		}
	// 	],
	// 	"extensions": ["unit_dropdown_extension"],
	// 	"colour": blocksColor.unit,
	// 	"output": "UnitType"
	// },
	{
		"type": "Unitbinded",
		"message0": "已绑定的单位",
		"colour": blocksColor.unit,
		"output": "Unit"
	},
	{
		"type": "UnitIdle",
		"message0": "令所选单位停止移动",
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unitstop",
		"message0": "令所选单位中止进行中的操作",
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unitapproach",
		"message0": "令所选单位靠近坐标 x %2 y %3 半径 %1 格 ",
		"args0": [
			{
				"type": "input_value",
				"name": "RADIUS",
				"check": "Number",
			},
			{
				"type": "input_value",
				"name": "X",
				"check": "Number",
			},
			{
				"type": "input_value",
				"name": "Y",
				"check": "Number",
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unitboost",
		"message0": "设置所选单位推进器 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "value",
				"options": [
					["开启", "true"],
					["关闭", "false"]
				]
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unitmove",
		"message0": "令所选单位移至坐标 x %1 y %2",
		"args0": [
			{
				"type": "input_value",
				"name": "X",
				"check": "Number",
			},
			{
				"type": "input_value",
				"name": "Y",
				"check": "Number",
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "Unittarget",
		"message0": "所选单位向坐标 x %2 y %3 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "MODE",
				"options": [
					["射击", "true"],
					["瞄准", "false"]
				]
			},
			{
				"type": "input_value",
				"name": "X",
				"check": "Number"
			},
			{
				"type": "input_value",
				"name": "Y",
				"check": "Number"
			},
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unittargetp",
		"message0": "令所选单位向单位 %2 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "MODE",
				"options": [
					["预瞄并射击", "true"],
					["预瞄", "false"]
				]
			},
			{
				"type": "input_value",
				"name": "UNIT",
				"check": ["variables_get", "Unit"],
			},
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unitidrop",
		"message0": "令所选单位将物品放入 %1，数量 %2",
		"args0": [
			{
				"type": "input_value",
				"name": "TO",
				"check": ["variables_get", "Block"]
			},
			{
				"type": "input_value",
				"name": "AMOUNT",
				"check": "Number"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "Unitithrow",
		"message0": "令所选单位丢弃物品，数量 %1",
		"args0": [
			{
				"type": "input_value",
				"name": "AMOUNT",
				"check": "Number"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unititake",
		"message0": "令所选单位将物品拿出 从 %1物品 %2数量 %3",
		"lastDummyAlign0": "RIGHT",
		"args0": [
			{
				"type": "input_value",
				"name": "FROM",
				"check": ["variables_get", "Block"]
			},
			{
				"type": "input_value",
				"name": "ITEM",
				"check": "item"
			},
			{
				"type": "input_value",
				"name": "AMOUNT",
				"check": "Number"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unitdrop",
		"message0": "令所选单位放下载荷",
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unittake",
		"message0": "令所选单位拿起 %1",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "TAKEUNITS",
				"options": [
					["单位", "true"],
					["建筑", "false"]
				]
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null
	},
	{
		"type": "Unitmine",
		"message0": "令所选单位挖矿，坐标 x %2 y %1",
		"args0": [
			{
				"type": "input_value",
				"name": "Y",
				"check": "Number"
			},
			{
				"type": "input_value",
				"name": "X",
				"check": "Number"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitFlag",
		"message0": "设置所选单位的标记值为 %1",
		"args0": [
			{
				"type": "input_value",
				"name": "FLAG",
				"check": "Number"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitBuild",
		"message0": "令所选单位于 x %4 y %5 建造建筑 %1，朝向为 %2，配置值（可选）继承自 %3",
		"args0": [
			{
				"type": "input_value",
				"name": "TYPE",
				"check": "BlockType"
			},
			{
				"type": "field_dropdown",
				"name": "DIR",
				"options": [
					["上", "1"],
					["下", "3"],
					["左", "2"],
					["右", "0"]
				]
			},
			{
				"type": "input_value",
				"name": "CONF",
				"check": ["Block", "item"]
			},
			{
				"type": "input_value",
				"name": "X",
				"check": "Number"
			},
			{
				"type": "input_value",
				"name": "Y",
				"check": "Number"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitGetBlock",
		"message0": "由所选单位获取 x %1 y %2 的方块并分别存储至：\n",
		"args0": [
			{
				"type": "input_value",
				"name": "X",
				"check": "Number"
			},
			{
				"type": "input_value",
				"name": "Y",
				"check": "Number"
			}
		],
		"message1": "建筑种类：%1",
		"args1": [
			{
				"type": "input_value",
				"name": "TYPE",
				"check": "variables_get"
			}
		],
		"message2": "建筑数据：%1",
		"args2": [
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": "variables_get"
			}
		],
		"message3": "地板类型：%1",
		"args3": [
			{
				"type": "input_value",
				"name": "FLOOR",
				"check": "variables_get"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitWithin",
		"message0": "所选单位位于坐标 x %2 y %3 半径 %1 格内 ",
		"args0": [
			{
				"type": "input_value",
				"name": "RADIUS",
				"check": "Number",
			},
			{
				"type": "input_value",
				"name": "X",
				"check": "Number",
			},
			{
				"type": "input_value",
				"name": "Y",
				"check": "Number",
			}
		],
		"colour": blocksColor.unit,
		"output": "Boolean",
	},
	{
		"type": "UnitUnbind",
		"message0": "恢复所选单位的AI",
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitRadar",
		"message0": "以所选单位为中心寻找%1、%2且%3单位，并取以%4为依据排序后的%5",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "FLITER_1",
				"options": [
					["任意的", "any"],
					["为敌方的", "enemy"],
					["为友方的", "ally"],
					["为玩家的", "player"],
					["攻击性的", "attacker"],
					["在空中的", "flying"],
					["是BOSS", "boss"],
					["在地面的", "ground"],
				]
			},
			{
				"type": "field_dropdown",
				"name": "FLITER_2",
				"options": [
					["任意的", "any"],
					["为敌方的", "enemy"],
					["为友方的", "ally"],
					["为玩家的", "player"],
					["攻击性的", "attacker"],
					["在空中的", "flying"],
					["是BOSS", "boss"],
					["在地面的", "ground"],
				]
			},
			{
				"type": "field_dropdown",
				"name": "FLITER_3",
				"options": [
					["任意的", "any"],
					["为敌方的", "enemy"],
					["为友方的", "ally"],
					["为玩家控制的", "player"],
					["攻击性的", "attacker"],
					["在空中的", "flying"],
					["是BOSS", "boss"],
					["在地面的", "ground"],
				]
			},
			{
				"type": "field_dropdown",
				"name": "SORT",
				"options": [
					["距离的负值", "distance"],
					["血量", "health"],
					["盾量", "shield"],
					["护甲值", "armor"],
					["血量上限", "maxHealth"]
				]
			},
			{
				"type": "field_dropdown",
				"name": "ORDER",
				"options": [
					["最大值", "true"],
					["最小值", "false"],
				]
			}
		],
		"colour": blocksColor.unit,
		"output": "Unit"
	},
	{
		"type": "UnitLocateOre",
		"message0": "由所选单位定位类型为%1的矿脉并分别存储至：\n",
		"args0": [
			{
				"type": "input_value",
				"name": "TYPE",
				"check": "item"
			},
		],
		"message1": "是否存在：%1",
		"args1": [
			{
				"type": "input_value",
				"name": "FOUND",
				"check": "variables_get"
			}
		],
		"message2": "x坐标：%1",
		"args2": [
			{
				"type": "input_value",
				"name": "X",
				"check": "variables_get"
			}
		],
		"message3": "y坐标：%1",
		"args3": [
			{
				"type": "input_value",
				"name": "Y",
				"check": "variables_get"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitLocateBuilding",
		"message0": "由所选单位定位%1的%2并分别存储至：\n",
		"args0": [
			{
				"type": "field_dropdown",
				"name": "ENEMY",
				"options": [
					["敌方", "true"],
					["友方", "false"],
				]
			},
			{
				"type": "field_dropdown",
				"name": "TYPE",
				"options": [
					["核心", "core"],
					["仓库", "storage"],
					["发电厂", "generator"],
					["炮塔", "turret"],
					["工厂", "fatcory"],
					["修复器", "repair"],
					["电池", "battery"],
					["反应堆", "reactor"],
				]
			}
		],
		"message1": "是否存在：%1",
		"args1": [
			{
				"type": "input_value",
				"name": "FOUND",
				"check": "variables_get"
			}
		],
		"message2": "x: %1",
		"args2": [
			{
				"type": "input_value",
				"name": "X",
				"check": "variables_get"
			}
		],
		"message3": "y: %1",
		"args3": [
			{
				"type": "input_value",
				"name": "Y",
				"check": "variables_get"
			}
		],
		"message4": "建筑数据： %1",
		"args4": [
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": "variables_get"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitLocateDamaged",
		"message0": "由所选单位定位受损友方建筑，并分别存储至：\n",
		"message1": "是否存在：%1",
		"args1": [
			{
				"type": "input_value",
				"name": "FOUND",
				"check": "variables_get"
			}
		],
		"message2": "x: %1",
		"args2": [
			{
				"type": "input_value",
				"name": "X",
				"check": "variables_get"
			}
		],
		"message3": "y: %1",
		"args3": [
			{
				"type": "input_value",
				"name": "Y",
				"check": "variables_get"
			}
		],
		"message4": "建筑数据： %1",
		"args4": [
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": "variables_get"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitLocateSpawn",
		"message0": "由所选单位定位敌方出生点或核心，并分别存储至：\n",
		"message1": "是否存在：%1",
		"args1": [
			{
				"type": "input_value",
				"name": "FOUND",
				"check": "variables_get"
			}
		],
		"message2": "x: %1",
		"args2": [
			{
				"type": "input_value",
				"name": "X",
				"check": "variables_get"
			}
		],
		"message3": "y: %1",
		"args3": [
			{
				"type": "input_value",
				"name": "Y",
				"check": "variables_get"
			}
		],
		"message4": "核心（若存在）： %1",
		"args4": [
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": "variables_get"
			}
		],
		"colour": blocksColor.unit,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "UnitProp",
		"message0": "单位%1的%2",
		"args0":[
			{
				"type": "input_value",
				"name": "UNIT",
				"check": ["variables_get", "Unit"]
			},
			{
				"type": "field_dropdown",
				"name": "VALUE",
				"options": [
					["x 坐标", "x"],
					["y 坐标", "y"],
					["单位类型", "type"],
					["队伍 ID", "team"],
					["单位 ID", "id"],
					["生命值", "health"],
					["生命上限", "maxHealth"],
					["旋转角度（度）", "rotation"],
					["单位大小", "size"],
					["护盾值", "shield"],
					["基础移速", "speed"],
					["攻击范围", "range"],
					["采矿点的 x 坐标", "minex"],
					["采矿点的 y 坐标", "mineY"],
					["控制类型", "controlled"],
					["flag 值", "flag"],
					["所带载荷数", "payloadCount"],
					["所带载荷类型", "payloadType"],
					["所带物品数", "totalItems"],
					["所带的第一个物品类型", "firstItem"],
					["物品容量上限", "itemCapacity"],	
				]
			}
		],
		"colour": blocksColor.unit,
		"output": ["Number", "properties"]
	},
	{
		"type": "UnitPropBool",
		"message0": "单位%1%2",
		"args0":[
			{
				"type": "input_value",
				"name": "UNIT",
				"check": ["variables_get", "Unit"]
			},
			{
				"type": "field_dropdown",
				"name": "VALUE",
				"options": [
					["已经死亡", "dead"],
					["正在攻击", "shooting"],
					["正在助推", "boosting"],
					["正在飞行", "flying"],
					["正在采矿", "mining"],
				]
			}
		],
		"colour": blocksColor.unit,
		"output": "Boolean"
	},
	{
		"type": "VarsThis",
		"message0": "当前处理器",
		"colour": blocksColor.operate,
		"output": "Block"
	},
	
	//memory io
	{
		"type": "MemSet",
		"message0": "记 %1 为内存元 %2 的内存空间，大小为 %3",
		"lastDummyAlign0": "RIGHT",
		"args0": [
			{
				"type": "field_input",
				"name": "MEMORY",
				"check": "String"
			},
			{
				"type": "input_value",
				"name": "BUILDING",
				"check": "variables_get"
			},
			{
				"type": "input_value",
				"name": "SIZE",
				"check": "Number"
			}
		],
		"colour": blocksColor.memory,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "MemGet",
		"message0": "内存空间 %1 的第 %2 项",
		"lastDummyAlign0": "RIGHT",
		"args0": [
			{
				"type": "field_input",
				"name": "MEMORY",
				"check": "String"
			},
			{
				"type": "input_value",
				"name": "INDEX",
				"check": "Number"
			}
		],
		"colour": blocksColor.memory,
		"output": "Number"
	},
	{
		"type": "MemSetVal",
		"message0": "设置内存空间 %1 的第 %2 项为 %3",
		"lastDummyAlign0": "RIGHT",
		"args0": [
			{
				"type": "field_input",
				"name": "MEMORY",
				"check": "String"
			},
			{
				"type": "input_value",
				"name": "INDEX",
				"check": "Number"
			},
			{
				"type": "input_value",
				"name": "VALUE",
				"check": "Number"
			}
		],
		"colour": blocksColor.memory,
		"nextStatement": null,
		"previousStatement": null,
		"inputsInline": true,
	},
	{
		"type": "MemSize",
		"message0": "内存空间 %1 的大小",
		"lastDummyAlign0": "RIGHT",
		"args0": [
			{
				"type": "field_input",
				"name": "MEMORY",
				"check": "String"
			},
		],
		"colour": blocksColor.memory,
		"output": "Number"
	},
]);

Blockly.Blocks['printToFlush'].updateShape_ = function() {
  // 清除所有现有输入
  while (this.getInput('ARG0')) this.removeInput('ARG0');
  while (this.getInput('DUMMY')) this.removeInput('DUMMY');

  // 按顺序添加 ARG 输入
  for (let i = 0; i < this.itemCount_; i++) {
    this.appendValueInput('ARG' + i).setCheck(null);
  }

  // 添加 dummy 输入（显示文本）
  //this.appendDummyInput('DUMMY').appendField('输出至缓冲区:');
};