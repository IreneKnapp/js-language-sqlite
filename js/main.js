var _ = require("underscore");
var SQL = {};

SQL.showTokens = function(item) {
    if(_.isArray(item)) {
        return SQL.AST[item[0]].showTokens.apply(item.slice(1));
    } else throw "Array required.";
};

SQL.string = function(items) {
    if(_.isString(items)) return items;
    else throw "String required.";
}

SQL.list = function(items) {
    if(_.isArray(items)) return items;
    else throw "Array required.";
}

SQL.maybe = function(subtype, items) {
    if(_.isNull(items)) return null;
    else return subtype(items);
}

SQL.oneOrMore = function(items) {
    if(_.isArray(items) && (items.length > 0)) return items;
    else throw "At least one item required.";
};

SQL.float = function(item) {
    if(_.isNumber(item)) return item;
    else throw "Float required.";
};

SQL.nonnegativeFloat = function(item) {
    if(_.isNumber(item) && (item >= 0)) return item;
    else throw "Nonnegative float required.";
};

SQL.computeTypeNameAffinity = function(maybeTypeName) {
    throw "Unimplemented.";
};

SQL.computeAffinityTypeName = function(typeAffinity) {
    throw "Unimplemented.";
};

SQL.AST = {
    "Type": {
        constructors: {
            "Type": {
                values: ["TypeAffinity", "MaybeTypeName", "MaybeTypeSize"],
                showTokens: function(affinity, name, maybeTypeSize) {
                    return _.flatten([(name[0] == "NoTypeName")
                                      ? SQL.showTokens(affinity)
                                      : SQL.showTokens(name),
                                      SQL.showTokens(maybeTypeSize)],
                                     true);
                },
            },
        },
    },
    "TypeAffinity": {
        constructors: {
            "TypeAffinityText": {
                values: [],
                showTokens: function() {
                    return SQL.showTokens(["TypeName",
                            SQL.oneOrMore([["UnqualifiedIdentifier",
                                            "TEXT"]])]);
                },
            },
            "TypeAffinityNumeric": {
                values: [],
                showTokens: function() {
                    return SQL.showTokens(["TypeName",
                            SQL.oneOrMore([["UnqualifiedIdentifier",
                                            "NUMERIC"]])]);
                },
            },
            "TypeAffinityInteger": {
                values: [],
                showTokens: function() {
                    return SQL.showTokens(["TypeName",
                            SQL.oneOrMore([["UnqualifiedIdentifier",
                                            "INTEGER"]])]);
                },
            },
            "TypeAffinityReal": {
                values: [],
                showTokens: function() {
                    return SQL.showTokens(["TypeName",
                            SQL.oneOrMore([["UnqualifiedIdentifier",
                                            "REAL"]])]);
                },
            },
            "TypeAffinityNone": {
                values: [],
                showTokens: function() {
                    return SQL.showTokens(["NoTypeName"]]);
                },
            },
        },
    },
    "MaybeTypeName": {
        constructors: {
            "NoTypeName": {
                values: [],
                showTokens: function() {
                    return [];
                },
            },
            "TypeName": {
                values: [["oneOrMore", "UnqualifiedIdentifier"]],
                showTokens: function(identifiers) {
                    return _.flatten(_.map(identifiers, SQL.showTokens), true);
                },
            },
        },
    },
    "MaybeType": {
        constructors: {
            "NoType": {
                values: [],
                showTokens: function() {
                    return [];
                },
            },
            "JustType": {
                values: ["Type"],
                showTokens: function(type) {
                    return SQL.showTokens(type);
                },
            },
        },
    },
    "MaybeTypeSize": {
        constructors: {
            "NoTypeSize": {
                values: [],
                showTokens: function() {
                    return [];
                },
            },
            "TypeMaximumSize": {
                values: ["TypeSizeField"],
                showTokens: function(maximumSize) {
                    return _.flatten([[[PunctuationLeftParenthesis]],
                                      SQL.showTokens(maximumSize),
                                      [[PunctuationRightParenthesis]]],
                                     true);
                },
            },
            "TypeSize": {
                values: ["TypeSizeField", "TypeSizeField"],
                showTokens: function(minimumSize, maximumSize) {
                    return _.flatten([[[PunctuationLeftParenthesis]],
                                      SQL.showTokens(minimumSize),
                                      [[PunctuationComma]],
                                      SQL.showTokens(maximumSize),
                                      [[PunctuationRightParenthesis]]],
                                     true);
                },
            },
        },
    },
    "TypeSizeField": {
        constructors: {
            "DoubleSize": {
                values: ["MaybeSign", "NonnegativeDouble"],
                showTokens: function(maybeSign, nonnegativeDouble) {
                    return _.flatten([SQL.showTokens(maybeSign),
                                      [[LiteralFloat, nonnegativeDouble]]],
                                     true);
                },
            },
            "IntegerSize": {
                values: ["MaybeSign", "integer"],
                showTokens: function(maybeSign, word) {
                    return _.flatten([SQL.showTokens(maybeSign),
                                      [[LiteralInteger, word]]],
                                     true);
                },
            },
        },
    },
    "LikeType": {
        constructors: {
            "Like": {
                values: [],
            },
            "NotLike": {
                values: [],
            },
            "Glob": {
                values: [],
            },
            "NotGlob": {
                values: [],
            },
            "Regexp": {
                values: [],
            },
            "NotRegexp": {
                values: [],
            },
            "Match": {
                values: [],
            },
            "NotMatch": {
                values: [],
            },
        },
    },
    "Escape": {
        constructors: {
            "NoEscape": {
                values: [],
            },
            "Escape": {
                values: ["Expression"],
            },
        },
    },
    "MaybeSwitchExpression": {
        constructors: {
            "NoSwitch": {
                values: [],
            },
            "Switch": {
                values: ["Expression"],
            },
        },
    },
    "CasePair": {
        constructors: {
            "WhenThen": {
                values: ["Expression", "Expression"],
            },
        },
    },
    "Else": {
        constructors: {
            "NoElse": {
                values: [],
            },
            "Else": {
                values: ["Expression"],
            },
        },
    },
    "Expression": {
        constructors: {
            "ExpressionLiteralInteger": {
                values: ["integer"],
            },
            "ExpressionLiteralFloat": {
                values: ["NonnegativeDouble"],
            },
            "ExpressionLiteralString": {
                values: ["string"],
            },
            "ExpressionLiteralBlob": {
                values: ["string"],
            },
            "ExpressionLiteralNull": {
                values: [],
            },
            "ExpressionLiteralCurrentTime": {
                values: [],
            },
            "ExpressionLiteralCurrentDate": {
                values: [],
            },
            "ExpressionLiteralCurrentTimestamp": {
                values: [],
            },
            "ExpressionVariable": {
                values: [],
            },
            "ExpressionVariableN": {
                values: ["integer"],
            },
            "ExpressionVariableNamed": {
                values: ["string"],
            },
            "ExpressionIdentifier": {
                values: ["DoublyQualifiedIdentifier"],
            },
            "ExpressionUnaryNegative": {
                values: ["Expression"],
            },
            "ExpressionUnaryPositive": {
                values: ["Expression"],
            },
            "ExpressionUnaryBitwiseNot": {
                values: ["Expression"],
            },
            "ExpressionUnaryLogicalNot": {
                values: ["Expression"],
            },
            "ExpressionBinaryConcatenate": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryMultiply": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryDivide": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryModulus": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryAdd": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinarySubtract": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryLeftShift": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryRightShift": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryBitwiseAnd": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryBitwiseOr": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryLess": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryLessEquals": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryGreater": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryGreaterEquals": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryEquals": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryEqualsEquals": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryNotEquals": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryLessGreater": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryLogicalAnd": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBinaryLogicalOr": {
                values: ["Expression", "Expression"],
            },
            "ExpressionFunctionCall": {
                values: ["UnqualifiedIdentifier", ["list", "Expression"]],
            },
            "ExpressionFunctionCallDistinct": {
                values: ["UnqualifiedIdentifier", ["oneOrMore", "Expression"]],
            },
            "ExpressionFunctionCallStar": {
                values: ["UnqualifiedIdentifier"],
            },
            "ExpressionCast": {
                values: ["Expression", "Type"],
            },
            "ExpressionCollate": {
                values: ["Expression", "UnqualifiedIdentifier"],
            },
            "ExpressionLike": {
                values: ["Expression", "LikeType", "Expression", "Escape"],
            },
            "ExpressionIsnull": {
                values: ["Expression"],
            },
            "ExpressionNotnull": {
                values: ["Expression"],
            },
            "ExpressionNotNull": {
                values: ["Expression"],
            },
            "ExpressionIs": {
                values: ["Expression", "Expression"],
            },
            "ExpressionIsNot": {
                values: ["Expression", "Expression"],
            },
            "ExpressionBetween": {
                values: ["Expression", "Expression", "Expression"],
            },
            "ExpressionNotBetween": {
                values: ["Expression", "Expression", "Expression"],
            },
            "ExpressionInSelect": {
                values: ["Expression", ["Statement", "Select"]],
            },
            "ExpressionNotInSelect": {
                values: ["Expression", ["Statement", "Select"]],
            },
            "ExpressionInList": {
                values: ["Expression", ["list", "Expression"]],
            },
            "ExpressionNotInList": {
                values: ["Expression", ["list", "Expression"]],
            },
            "ExpressionInTable": {
                values: ["Expression", "SinglyQualifiedIdentifier"],
            },
            "ExpressionNotInTable": {
                values: ["Expression", "SinglyQualifiedIdentifier"],
            },
            "ExpressionSubquery": {
                values: [(Select)],
            },
            "ExpressionExistsSubquery": {
                values: [(Select)],
            },
            "ExpressionNotExistsSubquery": {
                values: [(Select)],
            },
            "ExpressionCase": {
                values: ["MaybeSwitchExpression", ["oneOrMore", "CasePair"], "Else"],
            },
            "ExpressionRaiseIgnore": {
                values: [],
            },
            "ExpressionRaiseRollback": {
                values: ["string"],
            },
            "ExpressionRaiseAbort": {
                values: ["string"],
            },
            "ExpressionRaiseFail": {
                values: ["string"],
            },
            "ExpressionParenthesized": {
                values: ["Expression"],
            },
        },
    },
    "MaybeUnique": {
        constructors: {
            "NoUnique": {
                values: [],
            },
            "Unique": {
                values: [],
            },
        },
    },
    "MaybeIfNotExists": {
        constructors: {
            "NoIfNotExists": {
                values: [],
            },
            "IfNotExists": {
                values: [],
            },
        },
    },
    "MaybeIfExists": {
        constructors: {
            "NoIfExists": {
                values: [],
            },
            "IfExists": {
                values: [],
            },
        },
    },
    "MaybeForEachRow": {
        constructors: {
            "NoForEachRow": {
                values: [],
            },
            "ForEachRow": {
                values: [],
            },
        },
    },
    "MaybeTemporary": {
        constructors: {
            "NoTemporary": {
                values: [],
            },
            "Temp": {
                values: [],
            },
            "Temporary": {
                values: [],
            },
        },
    },
    "MaybeCollation": {
        constructors: {
            "NoCollation": {
                values: [],
            },
            "Collation": {
                values: ["UnqualifiedIdentifier"],
            },
        },
    },
    "MaybeAscDesc": {
        constructors: {
            "NoAscDesc": {
                values: [],
            },
            "Asc": {
                values: [],
            },
            "Desc": {
                values: [],
            },
        },
    },
    "MaybeAutoIncrement": {
        constructors: {
            "NoAutoincrement": {
                values: [],
            },
            "Autoincrement": {
                values: [],
            },
        },
    },
    "MaybeSign": {
        constructors: {
            "NoSign": {
                values: [],
            },
            "PositiveSign": {
                values: [],
            },
            "NegativeSign": {
                values: [],
            },
        },
    },
    "MaybeColumn": {
        constructors: {
            "ElidedColumn": {
                values: [],
            },
            "Column": {
                values: [],
            },
        },
    },
    "AlterTableBody": {
        constructors: {
            "RenameTo": {
                values: ["UnqualifiedIdentifier"],
            },
            "AddColumn": {
                values: ["MaybeColumn", "ColumnDefinition"],
            },
        },
    },
    "ColumnDefinition": {
        constructors: {
            "ColumnDefinition": {
                values: ["UnqualifiedIdentifier", "MaybeType", ["list", "ColumnConstraint"]],
            },
        },
    },
    "DefaultValue": {
        constructors: {
            "DefaultValueSignedInteger": {
                values: ["MaybeSign", "integer"],
            },
            "DefaultValueSignedFloat": {
                values: ["MaybeSign", "NonnegativeDouble"],
            },
            "DefaultValueLiteralString": {
                values: ["string"],
            },
            "DefaultValueLiteralBlob": {
                values: ["string"],
            },
            "DefaultValueLiteralNull": {
                values: [],
            },
            "DefaultValueLiteralCurrentTime": {
                values: [],
            },
            "DefaultValueLiteralCurrentDate": {
                values: [],
            },
            "DefaultValueLiteralCurrentTimestamp": {
                values: [],
            },
            "DefaultValueExpression": {
                values: ["Expression"],
            },
        },
    },
    "IndexedColumn": {
        constructors: {
            "IndexedColumn": {
                values: ["UnqualifiedIdentifier", "MaybeCollation",
                         "MaybeAscDesc"],
            },
        },
    },
    "ColumnConstraint": {
        constructors: {
            "ColumnPrimaryKey": {
                values: ["MaybeConstraintName", "MaybeAscDesc", ["maybe", "ConflictClause"],
                         "MaybeAutoincrement"],
            },
            "ColumnNotNull": {
                values: ["MaybeConstraintName", ["maybe", "ConflictClause"]],
            },
            "ColumnUnique": {
                values: ["MaybeConstraintName", ["maybe", "ConflictClause"]],
            },
            "ColumnCheck": {
                values: ["MaybeConstraintName", "Expression"],
            },
            "ColumnDefault": {
                values: ["MaybeConstraintName", "DefaultValue"],
            },
            "ColumnCollate": {
                values: ["MaybeConstraintName", "UnqualifiedIdentifier"],
            },
            "ColumnForeignKey": {
                values: ["MaybeConstraintName", "ForeignKeyClause"],
            },
        },
    },
    "TableConstraint": {
        constructors: {
            "TablePrimaryKey": {
                values: ["MaybeConstraintName", ["oneOrMore", "IndexedColumn"],
                         ["maybe", "ConflictClause"]],
            },
            "TableUnique": {
                values: ["MaybeConstraintName", ["oneOrMore", "IndexedColumn"],
                         ["maybe", "ConflictClause"]],
            },
            "TableCheck": {
                values: ["MaybeConstraintName", "Expression"],
            },
            "TableForeignKey": {
                values: ["MaybeConstraintName", ["oneOrMore", "UnqualifiedIdentifier"],
                         "ForeignKeyClause"],
            },
        },
    },
    "MaybeConstraintName": {
        constructors: {
            "NoConstraintName": {
                values: [],
            },
            "ConstraintName": {
                values: ["UnqualifiedIdentifier"],
            },
        },
    },
    "TriggerTime": {
        constructors: {
            "Before": {
                values: [],
            },
            "After": {
                values: [],
            },
            "InsteadOf": {
                values: [],
            },
        },
    },
    "TriggerCondition": {
        constructors: {
            "DeleteOn": {
                values: [],
            },
            "InsertOn": {
                values: [],
            },
            "UpdateOn": {
                values: ["list", "UnqualifiedIdentifier"],
            },
        },
    },
    "ModuleArgument": {
        constructors: {
            "ModuleArgument": {
                values: ["string"],
            },
        },
    },
    "QualifiedTableName": {
        constructors: {
            "TableNoIndexedBy": {
                values: ["SinglyQualifiedIdentifier"],
            },
            "TableIndexedBy": {
                values: ["SinglyQualifiedIdentifier", "UnqualifiedIdentifier"],
            },
            "TableNotIndexed": {
                values: ["SinglyQualifiedIdentifier"],
            },
        },
    },
    "OrderingTerm": {
        constructors: {
            "OrderingTerm": {
                values: ["Expression", "MaybeCollation", "MaybeAscDesc"],
            },
        },
    },
    "PragmaBody": {
        constructors: {
            "EmptyPragmaBody": {
                values: [],
            },
            "EqualsPragmaBody": {
                values: ["PragmaValue"],
            },
            "CallPragmaBody": {
                values: ["PragmaValue"],
            },
        },
    },
    "PragmaValue": {
        constructors: {
            "SignedIntegerPragmaValue": {
                values: ["MaybeSign", "integer"],
            },
            "SignedFloatPragmaValue": {
                values: ["MaybeSign", "NonnegativeDouble"],
            },
            "NamePragmaValue": {
                values: ["UnqualifiedIdentifier"],
            },
            "StringPragmaValue": {
                values: ["string"],
            },
        },
    },
    "CreateTableBody": {
        constructors: {
            "ColumnsAndConstraints": {
                values: [["oneOrMore", "ColumnDefinition"], ["list", "TableConstraint"]],
            },
            "AsSelect": {
                values: [["Statement", "Select"]],
            },
        },
    },
    "InsertHead": {
        constructors: {
            "InsertNoAlternative": {
                values: [],
            },
            "InsertOrRollback": {
                values: [],
            },
            "InsertOrAbort": {
                values: [],
            },
            "InsertOrReplace": {
                values: [],
            },
            "InsertOrFail": {
                values: [],
            },
            "InsertOrIgnore": {
                values: [],
            },
            "Replace": {
                values: [],
            },
        },
    },
    "InsertBody": {
        constructors: {
            "InsertValues": {
                values: [["list", "UnqualifiedIdentifier"], ["oneOrMore", "Expression"]],
            },
            "InsertSelect": {
                values: [["list", "UnqualifiedIdentifier"], "Select"],
            },
            "InsertDefaultValues": {
                values: [],
            },
        },
    },
    "UpdateHead": {
        constructors: {
            "UpdateNoAlternative": {
                values: [],
            },
            "UpdateOrRollback": {
                values: [],
            },
            "UpdateOrAbort": {
                values: [],
            },
            "UpdateOrReplace": {
                values: [],
            },
            "UpdateOrFail": {
                values: [],
            },
            "UpdateOrIgnore": {
                values: [],
            },
        },
    },
    "Distinctness": {
        constructors: {
            "NoDistinctness": {
                values: [],
            },
            "Distinct": {
                values: [],
            },
            "All": {
                values: [],
            },
        },
    },
    "MaybeHaving": {
        constructors: {
            "NoHaving": {
                values: [],
            },
            "Having": {
                values: ["Expression"],
            },
        },
    },
    "MaybeAs": {
        constructors: {
            "NoAs": {
                values: [],
            },
            "As": {
                values: ["UnqualifiedIdentifier"],
            },
            "ElidedAs": {
                values: ["UnqualifiedIdentifier"],
            },
        },
    },
    "CompoundOperator": {
        constructors: {
            "Union": {
                values: [],
            },
            "UnionAll": {
                values: [],
            },
            "Intersect": {
                values: [],
            },
            "Except": {
                values: [],
            },
        },
    },
    "SelectCore": {
        constructors: {
            "SelectCore": {
                values: ["Distinctness", ["oneOrMore", "ResultColumn"], ["maybe", "FromClause"],
                         ["maybe", "WhereClause"], ["maybe", "GroupClause"]],
            },
        },
    },
    "ResultColumn": {
        constructors: {
            "Star": {
                values: [],
            },
            "TableStar": {
                values: ["UnqualifiedIdentifier"],
            },
            "Result": {
                values: ["Expression", "MaybeAs"],
            },
        },
    },
    "JoinSource": {
        constructors: {
            "JoinSource": {
                values: ["SingleSource",
                         ["list", ["tuple", "JoinOperation", "SingleSource", "JoinConstraint"]]],
            },
        },
    },
    "SingleSource": {
        constructors: {
            "TableSource": {
                values: ["SinglyQualifiedIdentifier", "MaybeAs", "MaybeIndexedBy"],
            },
            "SelectSource": {
                values: [["Statement", "Select"], "MaybeAs"],
            },
            "SubjoinSource": {
                values: ["JoinSource"],
            },
        },
    },
    "JoinOperation": {
        constructors: {
            "Comma": {
                values: [],
            },
            "Join": {
                values: [],
            },
            "OuterJoin": {
                values: [],
            },
            "LeftJoin": {
                values: [],
            },
            "LeftOuterJoin": {
                values: [],
            },
            "InnerJoin": {
                values: [],
            },
            "CrossJoin": {
                values: [],
            },
            "NaturalJoin": {
                values: [],
            },
            "NaturalOuterJoin": {
                values: [],
            },
            "NaturalLeftJoin": {
                values: [],
            },
            "NaturalLeftOuterJoin": {
                values: [],
            },
            "NaturalInnerJoin": {
                values: [],
            },
            "NaturalCrossJoin": {
                values: [],
            },
        },
    },
    "JoinConstraint": {
        constructors: {
            "NoConstraint": {
                values: [],
            },
            "On": {
                values: ["Expression"],
            },
            "Using": {
                values: ["oneOrMore", "UnqualifiedIdentifier"],
            },
        },
    },
    "MaybeIndexedBy": {
        constructors: {
            "NoIndexedBy": {
                values: [],
            },
            "IndexedBy": {
                values: ["UnqualifiedIdentifier"],
            },
            "NotIndexed": {
                values: [],
            },
        },
    },
    "FromClause": {
        constructors: {
            "From": {
                values: ["JoinSource"],
            },
        },
    },
    "WhereClause": {
        constructors: {
            "Where": {
                values: ["Expression"],
            },
        },
    },
    "GroupClause": {
        constructors: {
            "GroupBy": {
                values: ["oneOrMore", "OrderingTerm"], "MaybeHaving"
            },
        },
    },
    "OrderClause": {
        constructors: {
            "OrderBy": {
                values: ["oneOrMore", "OrderingTerm"],
            },
        },
    },
    "LimitClause": {
        constructors: {
            "Limit": {
                values: ["integer"],
            },
            "LimitOffset": {
                values: ["integer", "integer"],
            },
            "LimitComma": {
                values: ["integer", "integer"],
            },
        },
    },
    "WhenClause": {
        constructors: {
            "When": {
                values: ["Expression"],
            },
        },
    },
    "ConflictClause": {
        constructors: {
            "OnConflictRollback": {
                values: [],
            },
            "OnConflictAbort": {
                values: [],
            },
            "OnConflictFail": {
                values: [],
            },
            "OnConflictIgnore": {
                values: [],
            },
            "OnConflictReplace": {
                values: [],
            },
        },
    },
    "ForeignKeyClause": {
        constructors: {
            "References": {
                values: ["UnqualifiedIdentifier", ["list", "UnqualifiedIdentifier"],
                         ["list", "ForeignKeyClauseActionOrMatchPart"],
                         "MaybeForeignKeyClauseDeferrablePart"],
            },
        },
    },
    "ForeignKeyClauseActionOrMatchPart": {
        constructors: {
            "OnDelete": {
                values: ["ForeignKeyClauseActionPart"],
            },
            "OnUpdate": {
                values: ["ForeignKeyClauseActionPart"],
            },
            "ReferencesMatch": {
                values: ["UnqualifiedIdentifier"],
            },
        },
    },
    "ForeignKeyClauseActionPart": {
        constructors: {
            "SetNull": {
                values: [],
            },
            "SetDefault": {
                values: [],
            },
            "Cascade": {
                values: [],
            },
            "Restrict": {
                values: [],
            },
            "NoAction": {
                values: [],
            },
        },
    },
    "MaybeForeignKeyClauseDeferrablePart": {
        constructors: {
            "NoDeferrablePart": {
                values: [],
            },
            "Deferrable": {
                values: ["MaybeInitialDeferralStatus"],
            },
            "NotDeferrable": {
                values: ["MaybeInitialDeferralStatus"],
            },
        },
    },
    "MaybeInitialDeferralStatus": {
        constructors: {
            "NoInitialDeferralStatus": {
                values: [],
            },
            "InitiallyDeferred": {
                values: [],
            },
            "InitiallyImmediate": {
                values: [],
            },
        },
    },
    "CommitHead": {
        constructors: {
            "CommitCommit": {
                values: [],
            },
            "CommitEnd": {
                values: [],
            },
        },
    },
    "MaybeTransaction": {
        constructors: {
            "ElidedTransaction": {
                values: [],
            },
            "Transaction": {
                values: [],
            },
        },
    },
    "MaybeTransactionType": {
        constructors: {
            "NoTransactionType": {
                values: [],
            },
            "Deferred": {
                values: [],
            },
            "Immediate": {
                values: [],
            },
            "Exclusive": {
                values: [],
            },
        },
    },
    "MaybeDatabase": {
        constructors: {
            "ElidedDatabase": {
                values: [],
            },
            "Database": {
                values: [],
            },
        },
    },
    "MaybeSavepoint": {
        constructors: {
            "NoSavepoint": {
                values: [],
            },
            "To": {
                values: ["UnqualifiedIdentifier"],
            },
            "ToSavepoint": {
                values: ["UnqualifiedIdentifier"],
            },
        },
    },
    "MaybeReleaseSavepoint": {
        constructors: {
            "ElidedReleaseSavepoint": {
                values: ["UnqualifiedIdentifier"],
            },
            "ReleaseSavepoint": {
                values: ["UnqualifiedIdentifier"],
            },
        },
    },
    "StatementList": {
        constructors: {
            "StatementList": {
                values: ["list", "AnyStatement"],
            },
        },
    },
    "AnyStatement": {
        constructors: {
            "Statement": {
                values: ["Statement"],
            },
        },
    },
    "ExplainableStatement": {
        constructors: {
            "ExplainableStatement": {
                values: ["Statement"],
            },
        },
    },
    "TriggerStatement": {
        constructors: {
            "TriggerStatement": {
                values: ["Statement"],
            },
        },
    },
    "UnqualifiedIdentifier": {
        constructors: {
            "UnqualifiedIdentifier": {
                values: ["string"],
            },
        },
    },
    "SinglyQualifiedIdentifier": {
        constructors: {
            "SinglyQualifiedIdentifier": {
                values: ["maybe", "string"], "string"
            },
        },
    },
    "DoublyQualifiedIdentifier": {
        constructors: {
            "DoublyQualifiedIdentifier": {
                values: ["maybe", ["tuple", "string", ["maybe", "string"]]],
                         "string"
            },
        },
    },
    "Statement": {
        constructors: {
            "Explain": {
                values: ["ExplainableStatement"],
            },
            "ExplainQueryPlan": {
                values: ["ExplainableStatement"],
            },
            "AlterTable": {
                values: ["SinglyQualifiedIdentifier", "AlterTableBody"],
            },
            "Analyze": {
                values: ["SinglyQualifiedIdentifier"],
            },
            "Attach": {
                values: ["MaybeDatabase", "string", "UnqualifiedIdentifier"],
            },
            "Begin": {
                values: ["MaybeTransactionType", "MaybeTransaction"],
            },
            "Commit": {
                values: ["CommitHead", "MaybeTransaction"],
            },
            "CreateIndex": {
                values: ["MaybeUnique", "MaybeIfNotExists",
                         "SinglyQualifiedIdentifier", "UnqualifiedIdentifier",
                         ["oneOrMore", "IndexedColumn"]],
            },
            "CreateTable": {
                values: ["MaybeTemporary", "MaybeIfNotExists",
                         "SinglyQualifiedIdentifier", "CreateTableBody"],
            },
            "CreateTrigger": {
                values: ["MaybeTemporary", "MaybeIfNotExists",
                         "SinglyQualifiedIdentifier", "TriggerTime",
                         "TriggerCondition", "UnqualifiedIdentifier",
                         "MaybeForEachRow", ["maybe", "WhenClause"],
                         ["oneOrMore", "TriggerStatement"]],
            },
            "CreateView": {
                values: ["MaybeTemporary", "MaybeIfNotExists",
                         "SinglyQualifiedIdentifier", ["Statement", "Select"]],
            },
            "CreateVirtualTable": {
                values: ["SinglyQualifiedIdentifier", "UnqualifiedIdentifier",
                         ["list", "ModuleArgument"]],
            },
            "Delete": {
                values: ["QualifiedTableName", ["maybe", "WhereClause"]],
            },
            "DeleteLimited": {
                values: ["QualifiedTableName", ["maybe", "WhereClause"],
                         ["maybe", "OrderClause"], "LimitClause"],
            },
            "Detach": {
                values: ["MaybeDatabase", "UnqualifiedIdentifier"],
            },
            "DropIndex": {
                values: ["MaybeIfExists", "SinglyQualifiedIdentifier"],
            },
            "DropTable": {
                values: ["MaybeIfExists", "SinglyQualifiedIdentifier"],
            },
            "DropTrigger": {
                values: ["MaybeIfExists", "SinglyQualifiedIdentifier"],
            },
            "DropView": {
                values: ["MaybeIfExists", "SinglyQualifiedIdentifier"],
            },
            "Insert": {
                values: ["InsertHead", "SinglyQualifiedIdentifier",
                         "InsertBody"],
            },
            "Pragma": {
                values: ["SinglyQualifiedIdentifier", "PragmaBody"],
            },
            "Reindex": {
                values: ["SinglyQualifiedIdentifier"],
            },
            "Release": {
                values: ["MaybeReleaseSavepoint", "UnqualifiedIdentifier"],
            },
            "Rollback": {
                values: ["MaybeTransaction", "MaybeSavepoint"],
            },
            "Savepoint": {
                values: ["UnqualifiedIdentifier"],
            },
            "Select": {
                values: ["SelectCore",
                         ["tuple", "CompoundOperator", "SelectCore"],
                         ["maybe", "OrderClause"], ["maybe", "LimitClause"]],
            },
            "Update": {
                values: ["UpdateHead", "QualifiedTableName",
                         ["oneOrMore",
                          ["tuple", "UnqualifiedIdentifier", "Expression"]],
                         ["maybe", "WhereClause"]],
            },
            "UpdateLimited": {
                values: ["UpdateHead", "QualifiedTableName",
                         ["oneOrMore",
                          ["tuple", "UnqualifiedIdentifier", "Expression"]],
                         ["maybe", "WhereClause"], ["maybe", "OrderClause"],
                         "LimitClause"],
            },
            "Vacuum": {
            },
        },
    },
};

_.each(SQL.AST, function(astType, astTypeName) {
    astType.name = astTypeName;
});


/*
-- | Not an AST node but a token which corresponds to a primitive of SQL syntax.
--   Has an instance of 'Show' which prints a list of them as syntactically-valid
--   SQL with no line wrapping.
data Token = EndOfInputToken
           | Identifier String
           | LiteralInteger Word64
           | LiteralFloat NonnegativeDouble
           | LiteralString String
           | LiteralBlob BS.ByteString
           | Variable
           | VariableN Word64
           | VariableNamed String
           | ModuleArgumentToken String
           | PunctuationBarBar
           | PunctuationStar
           | PunctuationSlash
           | PunctuationPercent
           | PunctuationPlus
           | PunctuationMinus
           | PunctuationLessLess
           | PunctuationGreaterGreater
           | PunctuationAmpersand
           | PunctuationBar
           | PunctuationLess
           | PunctuationLessEquals
           | PunctuationGreater
           | PunctuationGreaterEquals
           | PunctuationEquals
           | PunctuationEqualsEquals
           | PunctuationBangEquals
           | PunctuationLessGreater
           | PunctuationTilde
           | PunctuationLeftParenthesis
           | PunctuationRightParenthesis
           | PunctuationComma
           | PunctuationDot
           | PunctuationSemicolon
           | KeywordAbort
           | KeywordAction
           | KeywordAdd
           | KeywordAfter
           | KeywordAll
           | KeywordAlter
           | KeywordAnalyze
           | KeywordAnd
           | KeywordAs
           | KeywordAsc
           | KeywordAttach
           | KeywordAutoincrement
           | KeywordBefore
           | KeywordBegin
           | KeywordBetween
           | KeywordBy
           | KeywordCascade
           | KeywordCase
           | KeywordCast
           | KeywordCheck
           | KeywordCollate
           | KeywordColumn
           | KeywordCommit
           | KeywordConflict
           | KeywordConstraint
           | KeywordCreate
           | KeywordCross
           | KeywordCurrentDate
           | KeywordCurrentTime
           | KeywordCurrentTimestamp
           | KeywordDatabase
           | KeywordDefault
           | KeywordDeferrable
           | KeywordDeferred
           | KeywordDelete
           | KeywordDesc
           | KeywordDetach
           | KeywordDistinct
           | KeywordDrop
           | KeywordEach
           | KeywordElse
           | KeywordEnd
           | KeywordEscape
           | KeywordExcept
           | KeywordExclusive
           | KeywordExists
           | KeywordExplain
           | KeywordFail
           | KeywordFor
           | KeywordForeign
           | KeywordFrom
           | KeywordFull
           | KeywordGlob
           | KeywordGroup
           | KeywordHaving
           | KeywordIf
           | KeywordIgnore
           | KeywordImmediate
           | KeywordIn
           | KeywordIndex
           | KeywordIndexed
           | KeywordInitially
           | KeywordInner
           | KeywordInsert
           | KeywordInstead
           | KeywordIntersect
           | KeywordInto
           | KeywordIs
           | KeywordIsnull
           | KeywordJoin
           | KeywordKey
           | KeywordLeft
           | KeywordLike
           | KeywordLimit
           | KeywordMatch
           | KeywordNatural
           | KeywordNo
           | KeywordNot
           | KeywordNotnull
           | KeywordNull
           | KeywordOf
           | KeywordOffset
           | KeywordOn
           | KeywordOr
           | KeywordOrder
           | KeywordOuter
           | KeywordPlan
           | KeywordPragma
           | KeywordPrimary
           | KeywordQuery
           | KeywordRaise
           | KeywordReferences
           | KeywordRegexp
           | KeywordReindex
           | KeywordRelease
           | KeywordRename
           | KeywordReplace
           | KeywordRestrict
           | KeywordRight
           | KeywordRollback
           | KeywordRow
           | KeywordSavepoint
           | KeywordSelect
           | KeywordSet
           | KeywordTable
           | KeywordTemp
           | KeywordTemporary
           | KeywordThen
           | KeywordTo
           | KeywordTransaction
           | KeywordTrigger
           | KeywordUnion
           | KeywordUnique
           | KeywordUpdate
           | KeywordUsing
           | KeywordVacuum
           | KeywordValues
           | KeywordView
           | KeywordVirtual
           | KeywordWhen
           | KeywordWhere


instance Show Token where
    show EndOfInputToken = "<eof>"
    show (Identifier identifier) =
        let validCharacter c = if isAscii c
                                 then (isAlphaNum c) || (elem c "_$")
                                 else True
            escapeCharacter '"' = "\"\""
            escapeCharacter c = ["list", "c"]
        in if (all validCharacter identifier) && (not $ elem identifier keywordList)
             then identifier
             else "\"" ++ (concat $ map escapeCharacter identifier) ++ "\""
    show (LiteralInteger integer) = show integer
    show (LiteralFloat nonnegativeDouble) = show $ fromNonnegativeDouble nonnegativeDouble
    show (LiteralString string) =
        let showChar char = case char of
                              '\'' -> "''"
                              _ -> ["list", "char"]
            showString string = concat $ map showChar string
        in "'" ++ showString string ++ "'"
    show (LiteralBlob bytestring) =
        let showWord word = case showHex word "" of
                              ["list", "a"] -> ['0', a]
                              a -> a
            showBytestring bytestring = concat $ map showWord $ BS.unpack bytestring
        in "x'" ++ showBytestring bytestring ++ "'"
    show Variable = "?"
    show (VariableN n) = "?" ++ (show n)
    show (VariableNamed name) = ":" ++ name
    show (ModuleArgumentToken string) = string
    show PunctuationBarBar = "||"
    show PunctuationStar = "*"
    show PunctuationSlash = "/"
    show PunctuationPercent = "%"
    show PunctuationPlus = "+" 
    show PunctuationMinus = "-"
    show PunctuationLessLess = "<<"
    show PunctuationGreaterGreater = ">>"
    show PunctuationAmpersand = "&"
    show PunctuationBar = "|"
    show PunctuationLess = "<"
    show PunctuationLessEquals = "<="
    show PunctuationGreater = ">"
    show PunctuationGreaterEquals = ">="
    show PunctuationEquals = "="
    show PunctuationEqualsEquals = "=="
    show PunctuationBangEquals = "!="
    show PunctuationLessGreater = "<>"
    show PunctuationTilde = "~"
    show PunctuationLeftParenthesis = "("
    show PunctuationRightParenthesis = ")"
    show PunctuationComma = ","
    show PunctuationDot = "."
    show PunctuationSemicolon = ";"
    show KeywordAbort = "ABORT"
    show KeywordAction = "ACTION"
    show KeywordAdd = "ADD"
    show KeywordAfter = "AFTER"
    show KeywordAll = "ALL"
    show KeywordAlter = "ALTER"
    show KeywordAnalyze = "ANALYZE"
    show KeywordAnd = "AND"
    show KeywordAs = "AS"
    show KeywordAsc = "ASC"
    show KeywordAttach = "ATTACH"
    show KeywordAutoincrement = "AUTOINCREMENT"
    show KeywordBefore = "BEFORE"
    show KeywordBegin = "BEGIN"
    show KeywordBetween = "BETWEEN"
    show KeywordBy = "BY"
    show KeywordCascade = "CASCADE"
    show KeywordCase = "CASE"
    show KeywordCast = "CAST"
    show KeywordCheck = "CHECK"
    show KeywordCollate = "COLLATE"
    show KeywordColumn = "COLUMN"
    show KeywordCommit = "COMMIT"
    show KeywordConflict = "CONFLICT"
    show KeywordConstraint = "CONSTRAINT"
    show KeywordCreate = "CREATE"
    show KeywordCross = "CROSS"
    show KeywordCurrentDate = "CURRENT_DATE"
    show KeywordCurrentTime = "CURRENT_TIME"
    show KeywordCurrentTimestamp = "CURRENT_TIMESTAMP"
    show KeywordDatabase = "DATABASE"
    show KeywordDefault = "DEFAULT"
    show KeywordDeferrable = "DEFERRABLE"
    show KeywordDeferred = "DEFERRED"
    show KeywordDelete = "DELETE"
    show KeywordDesc = "DESC"
    show KeywordDetach = "DETACH"
    show KeywordDistinct = "DISTINCT"
    show KeywordDrop = "DROP"
    show KeywordEach = "EACH"
    show KeywordElse = "ELSE"
    show KeywordEnd = "END"
    show KeywordEscape = "ESCAPE"
    show KeywordExcept = "EXCEPT"
    show KeywordExclusive = "EXCLUSIVE"
    show KeywordExists = "EXISTS"
    show KeywordExplain = "EXPLAIN"
    show KeywordFail = "FAIL"
    show KeywordFor = "FOR"
    show KeywordForeign = "FOREIGN"
    show KeywordFrom = "FROM"
    show KeywordFull = "FULL"
    show KeywordGlob = "GLOB"
    show KeywordGroup = "GROUP"
    show KeywordHaving = "HAVING"
    show KeywordIf = "IF"
    show KeywordIgnore = "IGNORE"
    show KeywordImmediate = "IMMEDIATE"
    show KeywordIn = "IN"
    show KeywordIndex = "INDEX"
    show KeywordIndexed = "INDEXED"
    show KeywordInitially = "INITIALLY"
    show KeywordInner = "INNER"
    show KeywordInsert = "INSERT"
    show KeywordInstead = "INSTEAD"
    show KeywordIntersect = "INTERSECT"
    show KeywordInto = "INTO"
    show KeywordIs = "IS"
    show KeywordIsnull = "ISNULL"
    show KeywordJoin = "JOIN"
    show KeywordKey = "KEY"
    show KeywordLeft = "LEFT"
    show KeywordLike = "LIKE"
    show KeywordLimit = "LIMIT"
    show KeywordMatch = "MATCH"
    show KeywordNatural = "NATURAL"
    show KeywordNo = "NO"
    show KeywordNot = "NOT"
    show KeywordNotnull = "NOTNULL"
    show KeywordNull = "NULL"
    show KeywordOf = "OF"
    show KeywordOffset = "OFFSET"
    show KeywordOn = "ON"
    show KeywordOr = "OR"
    show KeywordOrder = "ORDER"
    show KeywordOuter = "OUTER"
    show KeywordPlan = "PLAN"
    show KeywordPragma = "PRAGMA"
    show KeywordPrimary = "PRIMARY"
    show KeywordQuery = "QUERY"
    show KeywordRaise = "RAISE"
    show KeywordReferences = "REFERENCES"
    show KeywordRegexp = "REGEXP"
    show KeywordReindex = "REINDEX"
    show KeywordRelease = "RELEASE"
    show KeywordRename = "RENAME"
    show KeywordReplace = "REPLACE"
    show KeywordRestrict = "RESTRICT"
    show KeywordRight = "RIGHT"
    show KeywordRollback = "ROLLBACK"
    show KeywordRow = "ROW"
    show KeywordSavepoint = "SAVEPOINT"
    show KeywordSelect = "SELECT"
    show KeywordSet = "SET"
    show KeywordTable = "TABLE"
    show KeywordTemp = "TEMP"
    show KeywordTemporary = "TEMPORARY"
    show KeywordThen = "THEN"
    show KeywordTo = "TO"
    show KeywordTransaction = "TRANSACTION"
    show KeywordTrigger = "TRIGGER"
    show KeywordUnion = "UNION"
    show KeywordUnique = "UNIQUE"
    show KeywordUpdate = "UPDATE"
    show KeywordUsing = "USING"
    show KeywordVacuum = "VACUUM"
    show KeywordValues = "VALUES"
    show KeywordView = "VIEW"
    show KeywordVirtual = "VIRTUAL"
    show KeywordWhen = "WHEN"
    show KeywordWhere = "WHERE"
    showList [] string = "" ++ string
    showList (onlyToken:[]) string
        = show onlyToken ++ string
    showList (firstToken:rest@(PunctuationComma:_)) string
        = show firstToken ++ show rest
    showList (firstToken:rest@(PunctuationSemicolon:_)) string
        = show firstToken ++ show rest
    showList (firstToken:rest@(PunctuationDot:_)) string
        = show firstToken ++ show rest
    showList (firstToken:rest@(PunctuationRightParenthesis:_)) string
        = show firstToken ++ show rest
    showList (PunctuationSemicolon:rest@(_:_)) string
        = show PunctuationSemicolon ++ "\n" ++ show rest
    showList (PunctuationDot:rest@(_:_)) string
        = show PunctuationDot ++ show rest
    showList (PunctuationLeftParenthesis:rest@(_:_)) string
        = show PunctuationLeftParenthesis ++ show rest
    showList (firstToken:rest) string
        = show firstToken ++ " " ++ show rest ++ string


keywordList :: ["list", "string"]
keywordList
    = ["ABORT", "ACTION", "ADD", "AFTER", "ALL", "ALTER", "ANALYZE", "AND", "AS",
       "ASC", "ATTACH", "AUTOINCREMENT", "BEFORE", "BEGIN", "BETWEEN", "BY", "CASCADE",
       "CASE", "CAST", "CHECK", "COLLATE", "COLUMN", "COMMIT", "CONFLICT", "CONSTRAINT",
       "CREATE", "CROSS", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP",
       "DATABASE", "DEFAULT", "DEFERRABLE", "DEFERRED", "DELETE", "DESC", "DETACH",
       "DISTINCT", "DROP", "EACH", "ELSE", "END", "ESCAPE", "EXCEPT", "EXCLUSIVE",
       "EXISTS", "EXPLAIN", "FAIL", "FOR", "FOREIGN", "FROM", "FULL", "GLOB", "GROUP",
       "HAVING", "IF", "IGNORE", "IMMEDIATE", "IN", "INDEX", "INDEXED", "INITIALLY",
       "INNER", "INSERT", "INSTEAD", "INTERSECT", "INTO", "IS", "ISNULL", "JOIN",
       "KEY", "LEFT", "LIKE", "LIMIT", "MATCH", "NATURAL", "NO", "NOT", "NOTNULL",
       "NULL", "OF", "OFFSET", "ON", "OR", "ORDER", "OUTER", "PLAN", "PRAGMA",
       "PRIMARY", "QUERY", "RAISE", "REFERENCES", "REGEXP", "REINDEX", "RELEASE",
       "RENAME", "REPLACE", "RESTRICT", "RIGHT", "ROLLBACK", "ROW", "SAVEPOINT",
       "SELECT", "SET", "TABLE", "TEMP", "TEMPORARY", "THEN", "TO", "TRANSACTION",
       "TRIGGER", "UNION", "UNIQUE", "UPDATE", "USING", "VACUUM", "VALUES", "VIEW",
       "VIRTUAL", "WHEN", "WHERE"]
*/

_.bindAll(SQL);
module.exports = SQL;

