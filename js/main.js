var _ = require("underscore");
var SQL = {};

SQL.showTokens = function(item) {
    return item._showTokens();
};

SQL.oneOrMore = function(items) {
    if(_.isArray(items) && (items.length > 0)) return items;
    else throw "At least one item required.";
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
data TypeSizeField = DoubleSize MaybeSign NonnegativeDouble
                   | IntegerSize MaybeSign Word64
    },
    "LikeType": {
data LikeType = Like
              | NotLike
              | Glob
              | NotGlob
              | Regexp
              | NotRegexp
              | Match
              | NotMatch
    },
    "Escape": {
data Escape = NoEscape | Escape Expression
    },
    "MaybeSwitchExpression": {
data MaybeSwitchExpression = NoSwitch | Switch Expression
                             deriving (Eq, Show)
    },
    "CasePair": {
data CasePair = WhenThen Expression Expression
                deriving (Eq, Show)
    },
    "Else": {
data Else = NoElse
          | Else Expression
    },
    "Expression": {
data Expression = ExpressionLiteralInteger Word64
                -- ^ Represents a literal integer expression.
                | ExpressionLiteralFloat NonnegativeDouble
                -- ^ Represents a literal floating-point expression.
                | ExpressionLiteralString String
                -- ^ Represents a literal string expression.
                | ExpressionLiteralBlob BS.ByteString
                -- ^ Represents a literal blob (binary large object) expression.
                | ExpressionLiteralNull
                -- ^ Represents a literal @NULL@ expression.
                | ExpressionLiteralCurrentTime
                -- ^ Represents a literal @current_time@ expression.
                | ExpressionLiteralCurrentDate
                -- ^ Represents a literal @current_date@ expression.
                | ExpressionLiteralCurrentTimestamp
                -- ^ Represents a literal @current_timestamp@ expression.
                | ExpressionVariable
                -- ^ Represents a positional-variable expression, written in SQL as @?@.
                | ExpressionVariableN Word64
                -- ^ Represents a numbered positional variable expression, written in
                --   SQL as @?nnn@.
                | ExpressionVariableNamed String
                -- ^ Represents a named positional variable expression, written in
                --   SQL as @:aaaa@.
                | ExpressionIdentifier DoublyQualifiedIdentifier
                -- ^ Represents a column-name expression, optionally qualified by a
                --   table name and further by a database name.
                | ExpressionUnaryNegative Expression
                -- ^ Represents a unary negation expression.
                | ExpressionUnaryPositive Expression
                -- ^ Represents a unary positive-sign expression.  Yes, this is an nop.
                | ExpressionUnaryBitwiseNot Expression
                -- ^ Represents a unary bitwise negation expression.
                | ExpressionUnaryLogicalNot Expression
                -- ^ Represents a unary logical negation expression.
                | ExpressionBinaryConcatenate Expression Expression
                -- ^ Represents a binary string-concatenation expression.
                | ExpressionBinaryMultiply Expression Expression
                -- ^ Represents a binary multiplication expression.
                | ExpressionBinaryDivide Expression Expression
                -- ^ Represents a binary division expression.
                | ExpressionBinaryModulus Expression Expression
                -- ^ Represents a binary modulus expression.
                | ExpressionBinaryAdd Expression Expression
                -- ^ Represents a binary addition expression.
                | ExpressionBinarySubtract Expression Expression
                -- ^ Represents a binary subtraction expression.
                | ExpressionBinaryLeftShift Expression Expression
                -- ^ Represents a binary left-shift expression.
                | ExpressionBinaryRightShift Expression Expression
                -- ^ Represents a binary right-shift expression.
                | ExpressionBinaryBitwiseAnd Expression Expression
                -- ^ Represents a binary bitwise-and expression.
                | ExpressionBinaryBitwiseOr Expression Expression
                -- ^ Represents a binary bitwise-or expression.
                | ExpressionBinaryLess Expression Expression
                -- ^ Represents a binary less-than comparison expression.
                | ExpressionBinaryLessEquals Expression Expression
                -- ^ Represents a binary less-than-or-equal-to comparison expression.
                | ExpressionBinaryGreater Expression Expression
                -- ^ Represents a binary greater-than comparison expression.
                | ExpressionBinaryGreaterEquals Expression Expression
                -- ^ Represents a binary greater-than-or-equal-to comparison expression.
                | ExpressionBinaryEquals Expression Expression
                -- ^ Represents a binary equal-to comparison expression, written in SQL
                --   as @=@.
                | ExpressionBinaryEqualsEquals Expression Expression
                -- ^ Represents a binary equal-to comparison expression, written in SQL
                --   as @==@.
                | ExpressionBinaryNotEquals Expression Expression
                -- ^ Represents a binary not-equal-to comparison expression, written in
                --   SQL as @!=@.
                | ExpressionBinaryLessGreater Expression Expression
                -- ^ Represents a binary not-equal-to comparison expression, written in
                --   SQL as @<>@.
                | ExpressionBinaryLogicalAnd Expression Expression
                -- ^ Represents a binary logical-and expression.
                | ExpressionBinaryLogicalOr Expression Expression
                -- ^ Represents a binary logical-or expression.
                | ExpressionFunctionCall UnqualifiedIdentifier [Expression]
                -- ^ Represents a call to a built-in function.
                | ExpressionFunctionCallDistinct UnqualifiedIdentifier
                                                 (OneOrMore Expression)
                -- ^ Represents a call to a built-in function, with the @DISTINCT@
                --   qualifier.
                | ExpressionFunctionCallStar UnqualifiedIdentifier
                -- ^ Represents a call to a built-in function, with @*@ as 
                --   parameter.
                | ExpressionCast Expression Type
                -- ^ Represents a type-cast expression.
                | ExpressionCollate Expression UnqualifiedIdentifier
                -- ^ Represents a @COLLATE@ expression.
                | ExpressionLike Expression LikeType Expression Escape
                -- ^ Represents a textual comparison expression.
                | ExpressionIsnull Expression
                -- ^ Represents an @ISNULL@ expression.  Not to be confused with an
                --   @IS@ expression with a literal @NULL@ as its right side; the
                --   meaning is the same but the parsing is different.
                | ExpressionNotnull Expression
                -- ^ Represents a @NOTNULL@ expression.  Not to be confused with a
                --   @NOT NULL@ expression; the meaning is the same but the parsing is
                --   different.
                | ExpressionNotNull Expression
                -- ^ Represents a @NOT NULL@ expression.  Not to be confused with a
                --   @NOTNULL@ expression; the meaning is the same but the parsing is
                --   different.
                | ExpressionIs Expression Expression
                -- ^ Represents an @IS@ expression.
                | ExpressionIsNot Expression Expression
                -- ^ Represents an @IS NOT@ expression.
                | ExpressionBetween Expression Expression Expression
                -- ^ Represents a @BETWEEN@ expression.
                | ExpressionNotBetween Expression Expression Expression
                -- ^ Represents a @NOT BETWEEN@ expression.
                | ExpressionInSelect Expression (Select)
                -- ^ Represents an @IN@ expression with the right-hand side being a
                --   @SELECT@ statement.
                | ExpressionNotInSelect Expression (Select)
                -- ^ Represents a @NOT IN@ expression with the right-hand side being a
                --   @SELECT@ statement.
                | ExpressionInList Expression [Expression]
                -- ^ Represents an @IN@ expression with the right-hand side being a
                --   list of subexpressions.
                | ExpressionNotInList Expression [Expression]
                -- ^ Represents a @NOT IN@ expression with the right-hand side being a
                --   list of subexpressions.
                | ExpressionInTable Expression SinglyQualifiedIdentifier
                -- ^ Represents an @IN@ expression with the right-hand side being a
                --   table name, optionally qualified by a database name.
                | ExpressionNotInTable Expression SinglyQualifiedIdentifier
                -- ^ Represents a @NOT IN@ expression with the right-hand side being a
                --   table name, optionally qualified by a database name.
                | ExpressionSubquery (Select)
                -- ^ Represents a subquery @SELECT@ expression.
                | ExpressionExistsSubquery (Select)
                -- ^ Represents a subquery @SELECT@ expression with the @EXISTS@
                --   qualifier.
                | ExpressionNotExistsSubquery (Select)
                -- ^ Represents a subquery @SELECT@ expression with the @NOT EXISTS@
                --   qualifier.
                | ExpressionCase MaybeSwitchExpression
                                 (OneOrMore CasePair)
                                 Else
                -- ^ Represents a @CASE@ expression.
                | ExpressionRaiseIgnore
                -- ^ Represents a @RAISE(IGNORE)@ expression.
                | ExpressionRaiseRollback String
                -- ^ Represents a @RAISE(ROLLBACK, string)@ expression.
                | ExpressionRaiseAbort String
                -- ^ Represents a @RAISE(ABORT, string)@ expression.
                | ExpressionRaiseFail String
                -- ^ Represents a @RAISE(FAIL, string)@ expression.
                | ExpressionParenthesized Expression
                -- ^ Represents a parenthesized subexpression.
    },
    "MaybeUnique": {
| NoUnique
| Unique
    },
    "MaybeIfNotExists": {
| NoIfNotExists
| IfNotExists
    },
    "MaybeIfExists": {
| NoIfExists
| IfExists
    },
    "MaybeForEachRow": {
| NoForEachRow
| ForEachRow
    },
    "MaybeTemporary": {
| NoTemporary
| Temp
| Temporary
    },
    "MaybeCollation": {
| NoCollation
| Collation UnqualifiedIdentifier
    },
    "MaybeAscDesc": {
| NoAscDesc
| Asc
| Desc
    },
    "MaybeAutoIncrement": {
| NoAutoincrement
| Autoincrement
    },
    "MaybeSign": {
| NoSign
| PositiveSign
| NegativeSign
    },
    "MaybeColumn": {
| ElidedColumn
| Column
    },
    "AlterTableBody": {
| RenameTo UnqualifiedIdentifier
| AddColumn MaybeColumn ColumnDefinition
    },
    "ColumnDefinition": {
| ColumnDefinition UnqualifiedIdentifier MaybeType [ColumnConstraint]
    },
    "DefaultValue": {
| DefaultValueSignedInteger MaybeSign Word64
| DefaultValueSignedFloat MaybeSign NonnegativeDouble
| DefaultValueLiteralString String
| DefaultValueLiteralBlob BS.ByteString
| DefaultValueLiteralNull
| DefaultValueLiteralCurrentTime
| DefaultValueLiteralCurrentDate
| DefaultValueLiteralCurrentTimestamp
| DefaultValueExpression Expression
    },
    "IndexedColumn": {
| IndexedColumn UnqualifiedIdentifier MaybeCollation MaybeAscDesc
    },
    "ColumnConstraint": {
| ColumnPrimaryKey MaybeConstraintName MaybeAscDesc (Maybe ConflictClause) MaybeAutoincrement
| ColumnNotNull MaybeConstraintName (Maybe ConflictClause)
| ColumnUnique MaybeConstraintName (Maybe ConflictClause)
| ColumnCheck MaybeConstraintName Expression
| ColumnDefault MaybeConstraintName DefaultValue
| ColumnCollate MaybeConstraintName UnqualifiedIdentifier
| ColumnForeignKey MaybeConstraintName ForeignKeyClause
    },
    "TableConstraint": {
| TablePrimaryKey MaybeConstraintName (OneOrMore IndexedColumn) (Maybe ConflictClause)
| TableUnique MaybeConstraintName (OneOrMore IndexedColumn) (Maybe ConflictClause)
| TableCheck MaybeConstraintName Expression
| TableForeignKey MaybeConstraintName (OneOrMore UnqualifiedIdentifier) ForeignKeyClause
    },
    "MaybeConstraintName": {
| NoConstraintName
| ConstraintName UnqualifiedIdentifier
    },
    "TriggerTime": {
| Before
| After
| InsteadOf
    },
    "TriggerCondition": {
| DeleteOn
| InsertOn
| UpdateOn [UnqualifiedIdentifier]
    },
    "ModuleArgument": {
| ModuleArgument String
    },
    "QualifiedTableName": {
| TableNoIndexedBy SinglyQualifiedIdentifier
| TableIndexedBy SinglyQualifiedIdentifier UnqualifiedIdentifier
| TableNotIndexed SinglyQualifiedIdentifier
    },
    "OrderingTerm": {
| OrderingTerm Expression MaybeCollation MaybeAscDesc
    },
    "PragmaBody": {
| EmptyPragmaBody
| EqualsPragmaBody PragmaValue
| CallPragmaBody PragmaValue
    },
    "PragmaValue": {
| SignedIntegerPragmaValue MaybeSign Word64
| SignedFloatPragmaValue MaybeSign NonnegativeDouble
| NamePragmaValue UnqualifiedIdentifier
| StringPragmaValue String
    },
    "CreateTableBody": {
| ColumnsAndConstraints (OneOrMore ColumnDefinition) [TableConstraint]
| AsSelect (Select)
    },
    "InsertHead": {
| InsertNoAlternative
| InsertOrRollback
| InsertOrAbort
| InsertOrReplace
| InsertOrFail
| InsertOrIgnore
| Replace
    },
    "InsertBody": {
| InsertValues [UnqualifiedIdentifier] (OneOrMore Expression)
| InsertSelect [UnqualifiedIdentifier] (Select)
| InsertDefaultValues
    },
    "UpdateHead": {
| UpdateNoAlternative
| UpdateOrRollback
| UpdateOrAbort
| UpdateOrReplace
| UpdateOrFail
| UpdateOrIgnore
    },
    "Distinctness": {
        constructors: {
            "NoDistinctness": {
                | Distinct
            }
            "All": {
                "MaybeHaving": {
            }
            "NoHaving": {
                | Having Expression
            }
    "MaybeAs": {
        constructors: {
            "NoAs": {
                | As UnqualifiedIdentifier
            }
            "ElidedAs": {
                UnqualifiedIdentifier
            }
    "CompoundOperator": {
        constructors: {
            "Union": {
                | UnionAll
            }
            "Intersect": {
                | Except
            }
    "SelectCore": {
        constructors: {
            "SelectCore": {
                Distinctness (OneOrMore ResultColumn) (Maybe FromClause) (Maybe WhereClause) (Maybe GroupClause)
            }
    "ResultColumn": {
        constructors: {
            "Star": {
                | TableStar UnqualifiedIdentifier
            }
            "Result": {
                Expression MaybeAs
            }
                    deriving (Eq, Show)
    "JoinSource": {
        constructors: {
            "JoinSource": {
                SingleSource [(JoinOperation, SingleSource, JoinConstraint)]
            }
                  deriving (Eq, Show)
    "SingleSource": {
        constructors: {
            "TableSource": {
                SinglyQualifiedIdentifier MaybeAs MaybeIndexedBy
            }
            "SelectSource": {
                (Select) MaybeAs
            }
            "SubjoinSource": {
                JoinSource
            }
    "JoinOperation": {
        constructors: {
            "Comma": {
                | Join
            }
            "OuterJoin": {
                | LeftJoin
            }
            "LeftOuterJoin": {
                | InnerJoin
            }
            "CrossJoin": {
                | NaturalJoin
            }
            "NaturalOuterJoin": {
                | NaturalLeftJoin
            }
            "NaturalLeftOuterJoin": {
                | NaturalInnerJoin
            }
            "NaturalCrossJoin": {
                "JoinConstraint": {
            }
            "NoConstraint": {
                | On Expression
            }
            "Using": {
                (OneOrMore UnqualifiedIdentifier)
            }
    "MaybeIndexedBy": {
        constructors: {
            "NoIndexedBy": {
                | IndexedBy UnqualifiedIdentifier
            }
            "NotIndexed": {
                "FromClause": {
            }
            "From": {
                JoinSource
            }
    "WhereClause": {
        constructors: {
            "Where": {
                Expression
            }
    "GroupClause": {
        constructors: {
            "GroupBy": {
                (OneOrMore OrderingTerm) MaybeHaving
            }
    "OrderClause": {
        constructors: {
            "OrderBy": {
                (OneOrMore OrderingTerm)
            }
    "LimitClause": {
        constructors: {
            "Limit": {
                Word64
            }
            "LimitOffset": {
                Word64 Word64
            }
            "LimitComma": {
                Word64 Word64
            }
    "WhenClause": {
        constructors: {
            "When": {
                Expression
            }
    "ConflictClause": {
        constructors: {
            "OnConflictRollback": {
                | OnConflictAbort
            }
            "OnConflictFail": {
                | OnConflictIgnore
            }
            "OnConflictReplace": {
                "ForeignKeyClause": {
            }
            "References": {
                UnqualifiedIdentifier [UnqualifiedIdentifier] [ForeignKeyClauseActionOrMatchPart] MaybeForeignKeyClauseDeferrablePart
            }
    "ForeignKeyClauseActionOrMatchPart": {
        constructors: {
            "OnDelete": {
                ForeignKeyClauseActionPart
            }
            "OnUpdate": {
                ForeignKeyClauseActionPart
            }
            "ReferencesMatch": {
                UnqualifiedIdentifier
            }
    "ForeignKeyClauseActionPart": {
        constructors: {
            "SetNull": {
                | SetDefault
            }
            "Cascade": {
                | Restrict
            }
            "NoAction": {
                "MaybeForeignKeyClauseDeferrablePart": {
            }
            "NoDeferrablePart": {
                | Deferrable MaybeInitialDeferralStatus
            }
            "NotDeferrable": {
                MaybeInitialDeferralStatus
            }
    "MaybeInitialDeferralStatus": {
        constructors: {
            "NoInitialDeferralStatus": {
                | InitiallyDeferred
            }
            "InitiallyImmediate": {
                "CommitHead": {
            }
            "CommitCommit": {
                | CommitEnd
            }
    "MaybeTransaction": {
        constructors: {
            "ElidedTransaction": {
                | Transaction
            }
    "MaybeTransactionType": {
        constructors: {
            "NoTransactionType": {
                | Deferred
            }
            "Immediate": {
                | Exclusive
            }
    "MaybeDatabase": {
        constructors: {
            "ElidedDatabase": {
                | Database
            }
    "MaybeSavepoint": {
        constructors: {
            "NoSavepoint": {
                | To UnqualifiedIdentifier
            }
            "ToSavepoint": {
                UnqualifiedIdentifier
            }
    "MaybeReleaseSavepoint": {
        constructors: {
            "ElidedReleaseSavepoint": {
                UnqualifiedIdentifier
            }
            "ReleaseSavepoint": {
                UnqualifiedIdentifier
            }
    "StatementList": {
        constructors: {
            "StatementList": {
                [AnyStatement]
            }
    "AnyStatement": {
        constructors: {
            "Statement": {
                Statement
            }
    "ExplainableStatement": {
        constructors: {
            "ExplainableStatement": {
                Statement
            }
    "TriggerStatement": {
        constructors: {
            "TriggerStatement": {
                Statement
            }
    "UnqualifiedIdentifier": {
        constructors: {
            "UnqualifiedIdentifier": {
                String
            }
    "SinglyQualifiedIdentifier": {
        constructors: {
            "SinglyQualifiedIdentifier": {
                (Maybe String) String
            }
    "DoublyQualifiedIdentifier": {
        constructors: {
            "DoublyQualifiedIdentifier": {
                (Maybe (String, (Maybe String))) String
            }
        }
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
        -> (OneOrMore IndexedColumn)
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
        -> (Maybe WhenClause)
        -> (OneOrMore TriggerStatement)
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
        -> [ModuleArgument]
        -> Statement L0 NT NS CreateVirtualTable'
    Delete
        :: QualifiedTableName
        -> (Maybe WhereClause)
        -> Statement L0 T NS Delete'
    DeleteLimited
        :: QualifiedTableName
        -> (Maybe WhereClause)
        -> (Maybe OrderClause)
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
        -> (Maybe OrderClause)
        -> (Maybe LimitClause)
        -> Statement L0 T S Select'
    Update
        :: UpdateHead
        -> QualifiedTableName
        -> (OneOrMore (UnqualifiedIdentifier, Expression))
        -> (Maybe WhereClause)
        -> Statement L0 T NS Update'
    UpdateLimited
        :: UpdateHead
        -> QualifiedTableName
        -> (OneOrMore (UnqualifiedIdentifier, Expression))
        -> (Maybe WhereClause)
        -> (Maybe OrderClause)
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
            escapeCharacter c = [c]
        in if (all validCharacter identifier) && (not $ elem identifier keywordList)
             then identifier
             else "\"" ++ (concat $ map escapeCharacter identifier) ++ "\""
    show (LiteralInteger integer) = show integer
    show (LiteralFloat nonnegativeDouble) = show $ fromNonnegativeDouble nonnegativeDouble
    show (LiteralString string) =
        let showChar char = case char of
                              '\'' -> "''"
                              _ -> [char]
            showString string = concat $ map showChar string
        in "'" ++ showString string ++ "'"
    show (LiteralBlob bytestring) =
        let showWord word = case showHex word "" of
                              [a] -> ['0', a]
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


keywordList :: [String]
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

