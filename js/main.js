var _ = require("underscore");
var SQL = {};

SQL.showTokens = function(item) {
    return item._showTokens();
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
            },
        },
    },
    "TypeAffinity": {
        constructors: {
            "TypeAffinityText": {
                values: [],
            },
            "TypeAffinityNumeric": {
                values: [],
            },
            "TypeAffinityInteger": {
                values: [],
            },
            "TypeAffinityReal": {
                values: [],
            },
            "TypeAffinityNone": {
                values: [],
            },
        },
    },
    "MaybeTypeName": {
        constructors: {
            "NoTypeName": {
                values: [],
            },
            "TypeName": {
                values: [["oneOrMore", "UnqualifiedIdentifier"]],
            },
        },
    },
    "MaybeType": {
        constructors: {
            "NoType": {
                values: [],
            },
            "JustType": {
                values: ["Type"],
            },
        },
    },
    "MaybeTypeSize": {
        constructors: {
            "NoTypeSize": {
                values: [],
            },
            "TypeMaximumSize": {
                values: ["TypeSizeField"],
            },
            "TypeSize": {
                values: ["TypeSizeField", "TypeSizeField"],
            },
        },
    },
    "TypeSizeField": {
        constructors: {
            "DoubleSize": {
                "MaybeSign" "NonnegativeDouble"
            },
            "IntegerSize": {
                "MaybeSign" "integer"
            },
    },
    "LikeType": {
        constructors: {
            "Like": {
            },
            "NotLike": {
            },
            "Glob": {
            },
            "NotGlob": {
            },
            "Regexp": {
            },
            "NotRegexp": {
            },
            "Match": {
            },
            "NotMatch": {
            },
    },
    "Escape": {
        constructors: {
            "NoEscape": {
            },
            "Escape": {
                "Expression"
            },
    },
    "MaybeSwitchExpression": {
        constructors: {
            "NoSwitch": {
            },
            "Switch": {
                "Expression"
            },
    },
    "CasePair": {
        constructors: {
            "WhenThen": {
                "Expression" "Expression"
            },
    },
    "Else": {
        constructors: {
            "NoElse": {
            },
            "Else": {
                "Expression"
            },
    },
    "Expression": {
        constructors: {
            "ExpressionLiteralInteger": {
                "integer"
            },
            "ExpressionLiteralFloat": {
                "NonnegativeDouble"
            },
            "ExpressionLiteralString": {
                "string"
            },
            "ExpressionLiteralBlob": {
                "string"
            },
            "ExpressionLiteralNull": {
            },
            "ExpressionLiteralCurrentTime": {
            },
            "ExpressionLiteralCurrentDate": {
            },
            "ExpressionLiteralCurrentTimestamp": {
            },
            "ExpressionVariable": {
            },
            "ExpressionVariableN": {
                "integer"
            },
            "ExpressionVariableNamed": {
                "string"
            },
            "ExpressionIdentifier": {
                "DoublyQualifiedIdentifier"
            },
            "ExpressionUnaryNegative": {
                "Expression"
            },
            "ExpressionUnaryPositive": {
                "Expression"
            },
            "ExpressionUnaryBitwiseNot": {
                "Expression"
            },
            "ExpressionUnaryLogicalNot": {
                "Expression"
            },
            "ExpressionBinaryConcatenate": {
                "Expression" "Expression"
            },
            "ExpressionBinaryMultiply": {
                "Expression" "Expression"
            },
            "ExpressionBinaryDivide": {
                "Expression" "Expression"
            },
            "ExpressionBinaryModulus": {
                "Expression" "Expression"
            },
            "ExpressionBinaryAdd": {
                "Expression" "Expression"
            },
            "ExpressionBinarySubtract": {
                "Expression" "Expression"
            },
            "ExpressionBinaryLeftShift": {
                "Expression" "Expression"
            },
            "ExpressionBinaryRightShift": {
                "Expression" "Expression"
            },
            "ExpressionBinaryBitwiseAnd": {
                "Expression" "Expression"
            },
            "ExpressionBinaryBitwiseOr": {
                "Expression" "Expression"
            },
            "ExpressionBinaryLess": {
                "Expression" "Expression"
            },
            "ExpressionBinaryLessEquals": {
                "Expression" "Expression"
            },
            "ExpressionBinaryGreater": {
                "Expression" "Expression"
            },
            "ExpressionBinaryGreaterEquals": {
                "Expression" "Expression"
            },
            "ExpressionBinaryEquals": {
                "Expression" "Expression"
            },
            "ExpressionBinaryEqualsEquals": {
                "Expression" "Expression"
            },
            "ExpressionBinaryNotEquals": {
                "Expression" "Expression"
            },
            "ExpressionBinaryLessGreater": {
                "Expression" "Expression"
            },
            "ExpressionBinaryLogicalAnd": {
                "Expression" "Expression"
            },
            "ExpressionBinaryLogicalOr": {
                "Expression" "Expression"
            },
            "ExpressionFunctionCall": {
                "UnqualifiedIdentifier" ["list", "Expression"]
            },
            "ExpressionFunctionCallDistinct": {
                "UnqualifiedIdentifier" ["oneOrMore", "Expression"]
            },
            "ExpressionFunctionCallStar": {
                "UnqualifiedIdentifier"
            },
            "ExpressionCast": {
                "Expression" "Type"
            },
            "ExpressionCollate": {
                "Expression" "UnqualifiedIdentifier"
            },
            "ExpressionLike": {
                "Expression" "LikeType" "Expression" "Escape"
            },
            "ExpressionIsnull": {
                "Expression"
            },
            "ExpressionNotnull": {
                "Expression"
            },
            "ExpressionNotNull": {
                "Expression"
            },
            "ExpressionIs": {
                "Expression" "Expression"
            },
            "ExpressionIsNot": {
                "Expression" "Expression"
            },
            "ExpressionBetween": {
                "Expression" "Expression" "Expression"
            },
            "ExpressionNotBetween": {
                "Expression" "Expression" "Expression"
            },
            "ExpressionInSelect": {
                "Expression" (Select)
            },
            "ExpressionNotInSelect": {
                "Expression" (Select)
            },
            "ExpressionInList": {
                "Expression" ["list", "Expression"]
            },
            "ExpressionNotInList": {
                "Expression" ["list", "Expression"]
            },
            "ExpressionInTable": {
                "Expression" "SinglyQualifiedIdentifier"
            },
            "ExpressionNotInTable": {
                "Expression" "SinglyQualifiedIdentifier"
            },
            "ExpressionSubquery": {
                (Select)
            },
            "ExpressionExistsSubquery": {
                (Select)
            },
            "ExpressionNotExistsSubquery": {
                (Select)
            },
            "ExpressionCase": {
                "MaybeSwitchExpression" ["oneOrMore", "CasePair"] "Else"
            },
            "ExpressionRaiseIgnore": {
            },
            "ExpressionRaiseRollback": {
                "string"
            },
            "ExpressionRaiseAbort": {
                "string"
            },
            "ExpressionRaiseFail": {
                "string"
            },
            "ExpressionParenthesized": {
                "Expression"
            },
    },
    "MaybeUnique": {
        constructors: {
            "NoUnique": {
            },
            "Unique": {
            },
    },
    "MaybeIfNotExists": {
        constructors: {
            "NoIfNotExists": {
            },
            "IfNotExists": {
            },
    },
    "MaybeIfExists": {
        constructors: {
            "NoIfExists": {
            },
            "IfExists": {
            },
    },
    "MaybeForEachRow": {
        constructors: {
            "NoForEachRow": {
            },
            "ForEachRow": {
            },
    },
    "MaybeTemporary": {
        constructors: {
            "NoTemporary": {
            },
            "Temp": {
            },
            "Temporary": {
            },
    "MaybeCollation": {
        constructors: {
            "NoCollation": {
            },
            "Collation": {
                "UnqualifiedIdentifier"
            },
    },
    "MaybeAscDesc": {
        constructors: {
            "NoAscDesc": {
            },
            "Asc": {
            },
            "Desc": {
            },
    "MaybeAutoIncrement": {
        constructors: {
            "NoAutoincrement": {
            },
            "Autoincrement": {
            },
    },
    "MaybeSign": {
        constructors: {
            "NoSign": {
            },
            "PositiveSign": {
            },
            "NegativeSign": {
            },
    "MaybeColumn": {
        constructors: {
            "ElidedColumn": {
            },
            "Column": {
            },
    },
    "AlterTableBody": {
        constructors: {
            "RenameTo": {
                "UnqualifiedIdentifier"
            },
            "AddColumn": {
                "MaybeColumn" "ColumnDefinition"
            },
    },
    "ColumnDefinition": {
        constructors: {
            "ColumnDefinition": {
                "UnqualifiedIdentifier" "MaybeType" ["list", "ColumnConstraint"]
            },
    },
    "DefaultValue": {
        constructors: {
            "DefaultValueSignedInteger": {
                "MaybeSign" "integer"
            },
            "DefaultValueSignedFloat": {
                "MaybeSign" "NonnegativeDouble"
            },
            "DefaultValueLiteralString": {
                "string"
            },
            "DefaultValueLiteralBlob": {
                "string"
            },
            "DefaultValueLiteralNull": {
            },
            "DefaultValueLiteralCurrentTime": {
            },
            "DefaultValueLiteralCurrentDate": {
            },
            "DefaultValueLiteralCurrentTimestamp": {
            },
            "DefaultValueExpression": {
                "Expression"
            },
    },
    "IndexedColumn": {
        constructors: {
            "IndexedColumn": {
                "UnqualifiedIdentifier" "MaybeCollation" "MaybeAscDesc"
            },
    },
    "ColumnConstraint": {
        constructors: {
            "ColumnPrimaryKey": {
                "MaybeConstraintName" "MaybeAscDesc" ["maybe", "ConflictClause"] "MaybeAutoincrement"
            },
            "ColumnNotNull": {
                "MaybeConstraintName" ["maybe", "ConflictClause"]
            },
            "ColumnUnique": {
                "MaybeConstraintName" ["maybe", "ConflictClause"]
            },
            "ColumnCheck": {
                "MaybeConstraintName" "Expression"
            },
            "ColumnDefault": {
                "MaybeConstraintName" "DefaultValue"
            },
            "ColumnCollate": {
                "MaybeConstraintName" "UnqualifiedIdentifier"
            },
            "ColumnForeignKey": {
                "MaybeConstraintName" "ForeignKeyClause"
            },
    },
    "TableConstraint": {
        constructors: {
            "TablePrimaryKey": {
                "MaybeConstraintName" ["oneOrMore", "IndexedColumn"] ["maybe", "ConflictClause"]
            },
            "TableUnique": {
                "MaybeConstraintName" ["oneOrMore", "IndexedColumn"] ["maybe", "ConflictClause"]
            },
            "TableCheck": {
                "MaybeConstraintName" "Expression"
            },
            "TableForeignKey": {
                "MaybeConstraintName" ["oneOrMore", "UnqualifiedIdentifier"] "ForeignKeyClause"
            },
    },
    "MaybeConstraintName": {
        constructors: {
            "NoConstraintName": {
            },
            "ConstraintName": {
                "UnqualifiedIdentifier"
            },
    },
    "TriggerTime": {
        constructors: {
            "Before": {
            },
            "After": {
            },
            "InsteadOf": {
            },
    "TriggerCondition": {
        constructors: {
            "DeleteOn": {
            },
            "InsertOn": {
            },
            "UpdateOn": {
                ["list", "UnqualifiedIdentifier"]
            },
    },
    "ModuleArgument": {
        constructors: {
            "ModuleArgument": {
                "string"
            },
    },
    "QualifiedTableName": {
        constructors: {
            "TableNoIndexedBy": {
                "SinglyQualifiedIdentifier"
            },
            "TableIndexedBy": {
                "SinglyQualifiedIdentifier" "UnqualifiedIdentifier"
            },
            "TableNotIndexed": {
                "SinglyQualifiedIdentifier"
            },
    },
    "OrderingTerm": {
        constructors: {
            "OrderingTerm": {
                "Expression" "MaybeCollation" "MaybeAscDesc"
            },
    },
    "PragmaBody": {
        constructors: {
            "EmptyPragmaBody": {
            },
            "EqualsPragmaBody": {
                "PragmaValue"
            },
            "CallPragmaBody": {
                "PragmaValue"
            },
    },
    "PragmaValue": {
        constructors: {
            "SignedIntegerPragmaValue": {
                "MaybeSign" "integer"
            },
            "SignedFloatPragmaValue": {
                "MaybeSign" "NonnegativeDouble"
            },
            "NamePragmaValue": {
                "UnqualifiedIdentifier"
            },
            "StringPragmaValue": {
                "string"
            },
    },
    "CreateTableBody": {
        constructors: {
            "ColumnsAndConstraints": {
                ["oneOrMore", "ColumnDefinition"] ["list", "TableConstraint"]
            },
            "AsSelect": {
                (Select)
            },
    },
    "InsertHead": {
        constructors: {
            "InsertNoAlternative": {
            },
            "InsertOrRollback": {
            },
            "InsertOrAbort": {
            },
            "InsertOrReplace": {
            },
            "InsertOrFail": {
            },
            "InsertOrIgnore": {
            },
            "Replace": {
            },
    "InsertBody": {
        constructors: {
            "InsertValues": {
                ["list", "UnqualifiedIdentifier"] ["oneOrMore", "Expression"]
            },
            "InsertSelect": {
                ["list", "UnqualifiedIdentifier"] (Select)
            },
            "InsertDefaultValues": {
            },
    "UpdateHead": {
        constructors: {
            "UpdateNoAlternative": {
            },
            "UpdateOrRollback": {
            },
            "UpdateOrAbort": {
            },
            "UpdateOrReplace": {
            },
            "UpdateOrFail": {
            },
            "UpdateOrIgnore": {
            },
    "Distinctness": {
        constructors: {
            "NoDistinctness": {
            },
            "Distinct": {
            },
            "All": {
            },
    "MaybeHaving": {
        constructors: {
            "NoHaving": {
            },
            "Having": {
                "Expression"
            },
    "MaybeAs": {
        constructors: {
            "NoAs": {
            },
            "As": {
                "UnqualifiedIdentifier"
            },
            "ElidedAs": {
                "UnqualifiedIdentifier"
            },
    "CompoundOperator": {
        constructors: {
            "Union": {
            },
            "UnionAll": {
            },
            "Intersect": {
            },
            "Except": {
            },
    "SelectCore": {
        constructors: {
            "SelectCore": {
                "Distinctness" ["oneOrMore", "ResultColumn"] ["maybe", "FromClause"] ["maybe", "WhereClause"] ["maybe", "GroupClause"]
            },
    "ResultColumn": {
        constructors: {
            "Star": {
            },
            "TableStar": {
                "UnqualifiedIdentifier"
            },
            "Result": {
                "Expression" "MaybeAs"
            },
    "JoinSource": {
        constructors: {
            "JoinSource": {
                "SingleSource" ["list", ["triple", "JoinOperation", "SingleSource", "JoinConstraint"]]
            },
    "SingleSource": {
        constructors: {
            "TableSource": {
                "SinglyQualifiedIdentifier" "MaybeAs" "MaybeIndexedBy"
            },
            "SelectSource": {
                (Select) "MaybeAs"
            },
            "SubjoinSource": {
                "JoinSource"
            },
    "JoinOperation": {
        constructors: {
            "Comma": {
            },
            "Join": {
            },
            "OuterJoin": {
            },
            "LeftJoin": {
            },
            "LeftOuterJoin": {
            },
            "InnerJoin": {
            },
            "CrossJoin": {
            },
            "NaturalJoin": {
            },
            "NaturalOuterJoin": {
            },
            "NaturalLeftJoin": {
            },
            "NaturalLeftOuterJoin": {
            },
            "NaturalInnerJoin": {
            },
            "NaturalCrossJoin": {
            },
    "JoinConstraint": {
        constructors: {
            "NoConstraint": {
            },
            "On": {
                "Expression"
            },
            "Using": {
                ["oneOrMore", "UnqualifiedIdentifier"]
            },
    "MaybeIndexedBy": {
        constructors: {
            "NoIndexedBy": {
            },
            "IndexedBy": {
                "UnqualifiedIdentifier"
            },
            "NotIndexed": {
            },
    "FromClause": {
        constructors: {
            "From": {
                "JoinSource"
            },
    "WhereClause": {
        constructors: {
            "Where": {
                "Expression"
            },
    "GroupClause": {
        constructors: {
            "GroupBy": {
                ["oneOrMore", "OrderingTerm"] "MaybeHaving"
            },
    "OrderClause": {
        constructors: {
            "OrderBy": {
                ["oneOrMore", "OrderingTerm"]
            },
    "LimitClause": {
        constructors: {
            "Limit": {
                "integer"
            },
            "LimitOffset": {
                "integer" "integer"
            },
            "LimitComma": {
                "integer" "integer"
            },
    "WhenClause": {
        constructors: {
            "When": {
                "Expression"
            },
    "ConflictClause": {
        constructors: {
            "OnConflictRollback": {
            },
            "OnConflictAbort": {
            },
            "OnConflictFail": {
            },
            "OnConflictIgnore": {
            },
            "OnConflictReplace": {
            },
    "ForeignKeyClause": {
        constructors: {
            "References": {
                "UnqualifiedIdentifier" ["list", "UnqualifiedIdentifier"] ["list", "ForeignKeyClauseActionOrMatchPart"] "MaybeForeignKeyClauseDeferrablePart"
            },
    "ForeignKeyClauseActionOrMatchPart": {
        constructors: {
            "OnDelete": {
                "ForeignKeyClauseActionPart"
            },
            "OnUpdate": {
                "ForeignKeyClauseActionPart"
            },
            "ReferencesMatch": {
                "UnqualifiedIdentifier"
            },
    "ForeignKeyClauseActionPart": {
        constructors: {
            "SetNull": {
            },
            "SetDefault": {
            },
            "Cascade": {
            },
            "Restrict": {
            },
            "NoAction": {
            },
    "MaybeForeignKeyClauseDeferrablePart": {
        constructors: {
            "NoDeferrablePart": {
            },
            "Deferrable": {
                "MaybeInitialDeferralStatus"
            },
            "NotDeferrable": {
                "MaybeInitialDeferralStatus"
            },
    "MaybeInitialDeferralStatus": {
        constructors: {
            "NoInitialDeferralStatus": {
            },
            "InitiallyDeferred": {
            },
            "InitiallyImmediate": {
            },
    "CommitHead": {
        constructors: {
            "CommitCommit": {
            },
            "CommitEnd": {
    "MaybeTransaction": {
        constructors: {
            "ElidedTransaction": {
            },
            "Transaction": {
    "MaybeTransactionType": {
        constructors: {
            "NoTransactionType": {
            },
            "Deferred": {
            },
            "Immediate": {
            },
            "Exclusive": {
    "MaybeDatabase": {
        constructors: {
            "ElidedDatabase": {
            },
            "Database": {
    "MaybeSavepoint": {
        constructors: {
            "NoSavepoint": {
            },
            "To": {
                "UnqualifiedIdentifier"
            },
            "ToSavepoint": {
                "UnqualifiedIdentifier"
            },
    "MaybeReleaseSavepoint": {
        constructors: {
            "ElidedReleaseSavepoint": {
                "UnqualifiedIdentifier"
            },
            "ReleaseSavepoint": {
                "UnqualifiedIdentifier"
            },
    "StatementList": {
        constructors: {
            "StatementList": {
                ["list", "AnyStatement"]
            },
    "AnyStatement": {
        constructors: {
            "Statement": {
                "Statement"
            },
    "ExplainableStatement": {
        constructors: {
            "ExplainableStatement": {
                "Statement"
            },
    "TriggerStatement": {
        constructors: {
            "TriggerStatement": {
                "Statement"
            },
    "UnqualifiedIdentifier": {
        constructors: {
            "UnqualifiedIdentifier": {
                "string"
            },
    "SinglyQualifiedIdentifier": {
        constructors: {
            "SinglyQualifiedIdentifier": {
                ["maybe", "string"] "string"
            },
    "DoublyQualifiedIdentifier": {
        constructors: {
            "DoublyQualifiedIdentifier": {
                ["maybe", ["pair", "string", ["maybe", "string"]]], "string"
            },
        },
/*
data Statement level triggerable valueReturning which where
    Explain
        :: ExplainableStatement
        -> Statement L1 NT NS Explain'
    ExplainQueryPlan
        :: ExplainableStatement
        -> Statement L1 NT NS ExplainQueryPlan'
    AlterTable
        :: SinglyQualifiedIdentifier
        -> AlterTableBody
        -> Statement L0 NT NS AlterTable'
    Analyze
        :: SinglyQualifiedIdentifier
        -> Statement L0 NT NS Analyze'
    Attach
        :: MaybeDatabase
        -> String
        -> UnqualifiedIdentifier
        -> Statement L0 NT NS Attach'
    Begin
        :: MaybeTransactionType
        -> MaybeTransaction
        -> Statement L0 NT NS Begin'
    Commit
        :: CommitHead
        -> MaybeTransaction
        -> Statement L0 NT NS Commit'
    CreateIndex
        :: MaybeUnique
        -> MaybeIfNotExists
        -> SinglyQualifiedIdentifier
        -> UnqualifiedIdentifier
        -> ["oneOrMore", "IndexedColumn"]
        -> Statement L0 NT NS CreateIndex'
    CreateTable
        :: MaybeTemporary
        -> MaybeIfNotExists
        -> SinglyQualifiedIdentifier
        -> CreateTableBody
        -> Statement L0 NT NS CreateTable'
    CreateTrigger
        :: MaybeTemporary
        -> MaybeIfNotExists
        -> SinglyQualifiedIdentifier
        -> TriggerTime
        -> TriggerCondition
        -> UnqualifiedIdentifier
        -> MaybeForEachRow
        -> ["maybe", "WhenClause"]
        -> ["oneOrMore", "TriggerStatement"]
        -> Statement L0 NT NS CreateTrigger'
    CreateView
        :: MaybeTemporary
        -> MaybeIfNotExists
        -> SinglyQualifiedIdentifier
        -> (Statement L0 T S Select')
        -> Statement L0 NT NS CreateView'
    CreateVirtualTable
        :: SinglyQualifiedIdentifier
        -> UnqualifiedIdentifier
        -> ["list", "ModuleArgument"]
        -> Statement L0 NT NS CreateVirtualTable'
    Delete
        :: QualifiedTableName
        -> ["maybe", "WhereClause"]
        -> Statement L0 T NS Delete'
    DeleteLimited
        :: QualifiedTableName
        -> ["maybe", "WhereClause"]
        -> ["maybe", "OrderClause"]
        -> LimitClause
        -> Statement L0 NT NS DeleteLimited'
    Detach
        :: MaybeDatabase
        -> UnqualifiedIdentifier
        -> Statement L0 NT NS Detach'
    DropIndex
        :: MaybeIfExists
        -> SinglyQualifiedIdentifier
        -> Statement L0 NT NS DropIndex'
    DropTable
        :: MaybeIfExists
        -> SinglyQualifiedIdentifier
        -> Statement L0 NT NS DropTable'
    DropTrigger
        :: MaybeIfExists
        -> SinglyQualifiedIdentifier
        -> Statement L0 NT NS DropTrigger'
    DropView
        :: MaybeIfExists
        -> SinglyQualifiedIdentifier
        -> Statement L0 NT NS DropView'
    Insert
        :: InsertHead
        -> SinglyQualifiedIdentifier
        -> InsertBody
        -> Statement L0 T NS Insert'
    Pragma
        :: SinglyQualifiedIdentifier
        -> PragmaBody
        -> Statement L0 NT NS Pragma'
    Reindex
        :: SinglyQualifiedIdentifier
        -> Statement L0 NT NS Reindex'
    Release
        :: MaybeReleaseSavepoint
        -> UnqualifiedIdentifier
        -> Statement L0 NT NS Release'
    Rollback
        :: MaybeTransaction
        -> MaybeSavepoint
        -> Statement L0 NT NS Rollback'
    Savepoint
        :: UnqualifiedIdentifier
        -> Statement L0 NT NS Savepoint'
    Select
        :: SelectCore
        -> [(CompoundOperator, SelectCore)]
        -> ["maybe", "OrderClause"]
        -> ["maybe", "LimitClause"]
        -> Statement L0 T S Select'
    Update
        :: UpdateHead
        -> QualifiedTableName
        -> (OneOrMore (UnqualifiedIdentifier, Expression))
        -> ["maybe", "WhereClause"]
        -> Statement L0 T NS Update'
    UpdateLimited
        :: UpdateHead
        -> QualifiedTableName
        -> (OneOrMore (UnqualifiedIdentifier, Expression))
        -> ["maybe", "WhereClause"]
        -> ["maybe", "OrderClause"]
        -> LimitClause
        -> Statement L0 NT NS UpdateLimited'
    Vacuum
        :: Statement L0 NT NS Vacuum'
*/
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

