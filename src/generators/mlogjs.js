/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { JavascriptGenerator, javascriptGenerator, Order } from 'blockly/javascript';
import { javascript } from 'webpack';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

javascriptGenerator.forBlock["stopScript"] = function(block, generator){
	return `stopScript();\n`;
};

javascriptGenerator.forBlock["endScript"] = function(block, generator){
	return `endScript();\n`;
};

javascriptGenerator.forBlock["logic_compareX"] = function(block, generator)
{
	const OP = {
		EQ: '==',
		NEQ: '!=',
		LT: '<',
		LTE: '<=',
		GT: '>',
		GTE: '>=',
		STRICT_EQ: '===',
	};
	const op = OP[block.getFieldValue('OP')];
	const order = (op == '===' || op == '==') ? Order.EQUALITY : Order.RELATIONAL;
	let a = javascriptGenerator.valueToCode(block, 'A', order);
	a = a === '' ? '0' : a;
	let b = javascriptGenerator.valueToCode(block, 'B', order);
	b = b === '' ? '0' : b;
	const code = a + ' ' + op + ' ' + b;
	return [code, order];
};

javascriptGenerator.forBlock["wait"] = function(block, generator)
{
	const sec = javascriptGenerator.valueToCode(block, 'sec', Order.MEMBER) || '0';
	const code = 'wait(' + sec + ');\n';
	return code;
};

//math part

javascriptGenerator.forBlock["math_bit"] = function(block, generator)
{
	const OP = {
		bAnd: '&',
		bOr: '|',
		bXor: '^',
		SHL: '<<',
		SHR: '>>',
	};
	const ORDER = {
		bAnd: Order.BITWISE_AND,
		bOr: Order.BITWISE_OR,
		bXor: Order.BITWISE_XOR,
		bRev: Order.BITWISE_NOT,
		SHL: Order.BITWISE_SHIFT,
		SHR: Order.BITWISE_SHIFT,
	};
	const optype = block.getFieldValue('OP');
	const op = OP[optype];
	const order = ORDER[optype];
	let a = javascriptGenerator.valueToCode(block, 'A', order) || 0;
	let b = javascriptGenerator.valueToCode(block, 'B', order) || 0;
	const code = a + ' ' + op + ' ' + b;
	return [code, order];
};

javascriptGenerator.forBlock["math_bitS"] = function(block, generator){
	const A = generator.valueToCode(block, 'A', Order.BITWISE_NOT) || 0;
	const code = `~${A}`;
	return [code, Order.BITWISE_NOT];
};

javascriptGenerator.forBlock["math_singleX"] = function(block, generator){
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const op = block.getFieldValue('OP');
	return[`Math.${op}(${x})`, Order.MEMBER];
};

javascriptGenerator.forBlock["math_m"] = function(block, generator){
	const a = generator.valueToCode(block, 'A', Order.MEMBER);
	const b = generator.valueToCode(block, 'B', Order.MEMBER);
	const op = block.getFieldValue('OP');
	return[`Math.${op}(${a}, ${b})`, Order.MEMBER];
};

//block part

javascriptGenerator.forBlock["getBuilding"] = function(block, generator){
	const id = block.getFieldValue('ID') || '';
	return [`getBuilding("${id}")`, Order.MEMBER];
}

javascriptGenerator.forBlock["mblock_link"] = function(block, generator){
	const id = block.getFieldValue('ID') || 0;
	return [`getLink(${id})`, Order.MEMBER];
}

javascriptGenerator.forBlock["mblock_S"] = function(block, generator){
	const blocktype = block.getFieldValue('value');
	const code = 'Blocks.' + blocktype;
	return [code, Order.MEMBER];
};

javascriptGenerator.forBlock["mblock_E"] = function(block, generator){
	const blocktype = block.getFieldValue('value');
	const code = 'Blocks.' + blocktype;
	return [code, Order.MEMBER];
};

javascriptGenerator.forBlock["mblockProperties"] = function(block, generator){
	const building = generator.valueToCode(block, 'block', Order.MEMBER) || 'null';
	const type = block.getFieldValue('value');
	const code = `sensor(getVar("@${type}"), ${building})`;
	return [code, Order.MEMBER];
}

javascriptGenerator.forBlock["mblockProperties2"] = function(block, generator){
	const building = generator.valueToCode(block, 'block', Order.MEMBER) || 'null';
	const tp = generator.valueToCode(block, 'value', Order.MEMBER) || 'null';
	if(tp.includes('Items.') || tp.includes('Liquids.'))
	{
		const property = tp.replace(/^(Items|Liquids)\./, '');
		const code = building + '.' + property + '';
		return [code, Order.MEMBER];
	}
	else
	{
		const code = 'sensor(' + tp + ', ' + building + ')'
		return [code, Order.MEMBER];
	}
}

javascriptGenerator.forBlock["BlockRadar"] = function(block, generator){
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER) || 'null';
	const fliter1 = block.getFieldValue('FLITER_1');
	const fliter2 = block.getFieldValue('FLITER_2');
	const fliter3 = block.getFieldValue('FLITER_3');
	const sort = block.getFieldValue('SORT');
	const order = block.getFieldValue('ORDER');
	const code = `radar({ building: ${building}, filters: ["${fliter1}", "${fliter2}", "${fliter3}"], order: ${order}, sort: "${sort}" })`;
	return [code, Order.MEMBER];
}


javascriptGenerator.forBlock["S_Item"] = function(block, generator){
	const blocktype = block.getFieldValue('value');
	const code = 'Items.' + blocktype;
	return [code, Order.MEMBER];
}

javascriptGenerator.forBlock["E_Item"] = function(block, generator){
	const blocktype = block.getFieldValue('value');
	const code = 'Items.' + blocktype;
	return [code, Order.MEMBER];
}

javascriptGenerator.forBlock["S_Liquid"] = function(block, generator){
	const blocktype = block.getFieldValue('value');
	const code = 'Liquids.' + blocktype;
	return [code, Order.MEMBER];
}

javascriptGenerator.forBlock["E_Liquid"] = function(block, generator){
	const blocktype = block.getFieldValue('value');
	const code = 'Liquids.' + blocktype;
	return [code, Order.MEMBER];
}

javascriptGenerator.forBlock["Iteminput"] = function(block, generator){
	const val = block.getFieldValue('value');
	const code = `getVar("@${val}")`;
	return [code, Order.MEMBER];
}

javascriptGenerator.forBlock["Unit_input"] = function(block, generator){
	const val = block.getFieldValue('Type');
	const code = `getVar("@${val}")`;
	return [code, Order.MEMBER];
}

javascriptGenerator.forBlock["mblock_input"] = function(block, generator){
	const val = block.getFieldValue('Type');
	const code = `getVar("@${val}")`;
	return [code, Order.MEMBER];
}

//unit part
javascriptGenerator.forBlock["Ubind"] = function(block, generator){
	const unitType = generator.valueToCode(block, 'UNIT', Order.MEMBER) || 'Units.flare';
	const code = 'unitBind(' + unitType + ');\n';
	return code;
};

javascriptGenerator.forBlock["S_Unit"] = function(block, generator){
	const type = block.getFieldValue('value');
	const code = 'Units.' + type;
	return [code, Order.MEMBER];
};

javascriptGenerator.forBlock["E_Unit"] = function(block, generator){
	const type = block.getFieldValue('value');
	const code = 'Units.' + type;
	return [code, Order.MEMBER];
};

javascriptGenerator.forBlock["Unitbinded"] = function(block, generator){
	return ['Vars.unit', Order.MEMBER];
};

javascriptGenerator.forBlock["Unitstop"] = function(block, generator){
	return 'unitControl.stop();\n'
};

javascriptGenerator.forBlock["UnitIdle"] = function(block, generator){
	return 'unitControl.idle();\n'
};

javascriptGenerator.forBlock["Unitapproach"] = function(block, generator){
	const radius = generator.valueToCode(block, 'RADIUS', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const code = 'unitControl.approach({ x: ' + x + ', y: ' + y + ', radius: ' + radius + " });\n";
	return code;
};

javascriptGenerator.forBlock["Unitmove"] = function(block, generator){
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const code = 'unitControl.move(' + x + ', ' + y + ');\n';
	return code;
};

javascriptGenerator.forBlock["Unitboost"] = function(block, generator){
	const mode = block.getFieldValue('value');
	const code = 'unitControl.boost(' + mode + ');\n';
	return code;
};

javascriptGenerator.forBlock["Unittarget"] = function(block, generator){
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const mode = block.getFieldValue('MODE');
	const code = 'unitControl.target({shoot: ' + mode + ', x: ' + x + ', y: ' + y + ' });\n';
	return code;
};

javascriptGenerator.forBlock["Unittargetp"] = function(block, generator){
	const unit = generator.valueToCode(block, 'UNIT', Order.MEMBER) || "null";
	const mode = block.getFieldValue('MODE');
	const code = `unitControl.targetp({ shoot: ${mode}, unit: ${unit} });\n`;
	return code;
};

javascriptGenerator.forBlock["Unititake"] = function(block, generator){
	const from = generator.valueToCode(block, 'FROM', Order.MEMBER);
	const item = generator.valueToCode(block, 'ITEM', Order.MEMBER);
	const amount = generator.valueToCode(block, 'AMOUNT', Order.MEMBER);
	const code = `unitControl.itemTake(${from}, ${item}, ${amount});\n`;
	return code;
};

javascriptGenerator.forBlock["Unitidrop"] = function(block, generator){
	const to = generator.valueToCode(block, 'TO', Order.MEMBER);
	const amount = generator.valueToCode(block, 'AMOUNT', Order.MEMBER);
	const code = `unitControl.itemDrop(${to}, ${amount});\n`;
	return code;
};

javascriptGenerator.forBlock["Unitithrow"] = function(block, generator){
	const amount = generator.valueToCode(block, 'AMOUNT', Order.MEMBER);
	const code = `unitControl.itemDrop(Blocks.air, ${amount});\n`;
	return code;
};

javascriptGenerator.forBlock["Unitdrop"] = function(block, generator){
	const code = `unitControl.payDrop();\n`;
	return code;
};

javascriptGenerator.forBlock["Unittake"] = function(block, generator){
	const tkunit = block.getFieldValue("TAKEUNITS");
	const code = `unitControl.payTake({ takeUnits: ${tkunit} });\n`;
	return code;
};

javascriptGenerator.forBlock["Unitmine"] = function(block, generator){
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const code = 'unitControl.mine(' + x + ', ' + y + ');\n';
	return code;
};

javascriptGenerator.forBlock['printToFlush'] = function(block, generator) {
  const args = [];
  for (let i = 0; i < block.itemCount_; i++) {
    const code = generator.valueToCode(block, 'ARG' + i, Order.NONE) || '';
    args.push(code);
  }
  return `print(${args.join(', ')});\n`;
};

javascriptGenerator.forBlock['printFlush'] = function(block, generator) {
	const memory = generator.valueToCode(block, 'MEMORY', Order.MEMBER) || '';
	return `printFlush(${memory});\n`;
};

javascriptGenerator.forBlock['UnitFlag'] = function(block, generator){
	const flag = generator.valueToCode(block, 'FLAG', Order.MEMBER) || '0';
	return `unitControl.flag(${flag});\n`;
};

javascriptGenerator.forBlock['UnitBuild'] = function(block, generator){
	const type = generator.valueToCode(block, 'TYPE', Order.MEMBER) || 'Blocks.copperWall';
	const dir = block.getFieldValue('DIR');
	const conf = generator.valueToCode(block, 'CONF', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER) || '0';
	const y = generator.valueToCode(block, 'Y', Order.MEMBER) || '0';
	if(conf == '')
	{
		return `unitControl.build({ x: ${x}, y: ${y}, block: ${type}, rotation: ${dir} });\n`
	}
	else
	{
		return `unitControl.build({ x: ${x}, y: ${y}, block: ${type}, rotation: ${dir}, config: ${conf} });\n`
	}
};

javascriptGenerator.forBlock['UnitGetBlock'] = function(block, generator){
	const type = generator.valueToCode(block, 'TYPE', Order.MEMBER);
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER);
	const floor = generator.valueToCode(block, 'FLOOR', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER) || '0';
	const y = generator.valueToCode(block, 'Y', Order.MEMBER) || '0';
	return `[${type}, ${building}, ${floor}] = unitControl.getBlock(${x}, ${y});\n`;
};

javascriptGenerator.forBlock["UnitWithin"] = function(block, generator){
	const radius = generator.valueToCode(block, 'RADIUS', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const code = 'unitControl.within({ x: ' + x + ', y: ' + y + ', radius: ' + radius + " })";
	return [code, Order.MEMBER];
};

javascriptGenerator.forBlock["UnitRadar"] = function(block, generator){
	const fliter1 = block.getFieldValue('FLITER_1');
	const fliter2 = block.getFieldValue('FLITER_2');
	const fliter3 = block.getFieldValue('FLITER_3');
	const sort = block.getFieldValue('SORT');
	const order = block.getFieldValue('ORDER');
	const code = `unitRadar({ filters: ["${fliter1}", "${fliter2}", "${fliter3}"], order: ${order}, sort: "${sort}" })`;
	return [code, Order.MEMBER];
}

javascriptGenerator.forBlock["UnitUnbind"] = function(block, generator){
	return "unitControl.unbind();\n";
}

javascriptGenerator.forBlock['UnitLocateOre'] = function(block, generator){
	const type = generator.valueToCode(block, 'TYPE', Order.MEMBER);
	const found = generator.valueToCode(block, 'FOUND', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	return `[${found}, ${x}, ${y}] = unitLocate.ore(${type});\n`;
};

javascriptGenerator.forBlock['UnitLocateBuilding'] = function(block, generator){
	const type = block.getFieldValue('TYPE');
	const enemy = block.getFieldValue('ENEMY');
	const found = generator.valueToCode(block, 'FOUND', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER);
	return `[${found}, ${x}, ${y}, ${building}] = unitLocate.building({ group: "${type}", enemy: ${enemy} });\n`;
};

javascriptGenerator.forBlock['UnitLocateSpawn'] = function(block, generator){
	const found = generator.valueToCode(block, 'FOUND', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER);
	return `[${found}, ${x}, ${y}, ${building}] = unitLocate.spawn();\n`;
};

javascriptGenerator.forBlock['UnitLocateDamaged'] = function(block, generator){
	const found = generator.valueToCode(block, 'FOUND', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER);
	return `[${found}, ${x}, ${y}, ${building}] = unitLocate.damaged();\n`;
};

javascriptGenerator.forBlock['math_rand'] = function(block, generator){
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	return [`Math.rand(${x})`, Order.MEMBER];
}

javascriptGenerator.forBlock["ControlEnabled"] = function(block, generator){
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER);
	const enabled = block.getFieldValue('ENABLED');
	return `control.enabled(${building}, ${enabled});`;
}

javascriptGenerator.forBlock["ControlShoot"] = function(block, generator){
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER);
	const x = generator.valueToCode(block, 'X', Order.MEMBER);
	const y = generator.valueToCode(block, 'Y', Order.MEMBER);
	const mode = block.getFieldValue('MODE');
	const code = `control.shoot({ building: ${building}, shoot: ${mode}, x: ${x}, y: ${y} });\n`;
	return code;
};

javascriptGenerator.forBlock["ControlShootp"] = function(block, generator){
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER);
	const unit = generator.valueToCode(block, 'UNIT', Order.MEMBER) || "null";
	const mode = block.getFieldValue('MODE');
	const code = `control.shootp({ building: ${building}, shoot: ${mode}, unit: ${unit} });\n`;
	return code;
};

javascriptGenerator.forBlock["ControlConfig"] = function(block, generator){
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER);
	const conf = generator.valueToCode(block, 'CONF', Order.MEMBER) || "Blocks.air";
	const code = `control.config(${building}, ${conf});\n`;
	return code;
};

javascriptGenerator.forBlock["VarsThis"] = function(block, generator){
	return ["Vars.this", Order.MEMBER];
};

javascriptGenerator.forBlock["ProcessorProp"] = function(block, generator){
	const value = block.getFieldValue('VALUE');
	return [`Vars.${value}`, Order.MEMBER];
};

javascriptGenerator.forBlock["UnitProp"] = function(block, generator){
	const unit = generator.valueToCode(block, 'UNIT', Order.MEMBER) || "null";
	const value = block.getFieldValue('VALUE');
	return [`${unit}.${value}`, Order.MEMBER];
};

javascriptGenerator.forBlock["UnitPropBool"] = function(block, generator){
	const unit = generator.valueToCode(block, 'UNIT', Order.MEMBER) || "null";
	const value = block.getFieldValue('VALUE');
	return [`${unit}.${value}`, Order.MEMBER];
};

//memory

javascriptGenerator.forBlock["MemSet"] = function(block, generator){
	const memory = block.getFieldValue("MEMORY") || 'mem';
	const building = generator.valueToCode(block, 'BUILDING', Order.MEMBER) || "null";
	const sz = generator.valueToCode(block, 'SIZE', Order.MEMBER) || "512";
	return `const ${memory} = new Memory(${building}, ${sz});\n`;
};

javascriptGenerator.forBlock["MemSetVal"] = function(block, generator){
	const memory = block.getFieldValue("MEMORY") || 'mem';
	const idx = generator.valueToCode(block, 'INDEX', Order.MEMBER) || "0";
	const value = generator.valueToCode(block, 'VALUE', Order.MEMBER) || "0";
	return `${memory}[${idx}] = ${value};\n`;
};

javascriptGenerator.forBlock["MemGet"] = function(block, generator){
	const memory = block.getFieldValue("MEMORY") || 'mem';
	const idx = generator.valueToCode(block, 'INDEX', Order.MEMBER) || "0";
	return [`${memory}[${idx}]`, Order.MEMBER];
};

javascriptGenerator.forBlock["MemSize"] = function(block, generator){
	const memory = block.getFieldValue("MEMORY") || 'mem';
	return [`${memory}.length`, Order.MEMBER];
};