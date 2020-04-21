var documenterSearchIndex = {"docs":
[{"location":"#MLJScientificTypes.jl-1","page":"Home","title":"MLJScientificTypes.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Implementation of a convention for scientific types, as used in the MLJ universe.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"This package makes a distinction between machine type and scientific type:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The machine type refers to the Julia type begin used to represent the data (for instance, Float64).\nThe scientific type is one of the types defined in ScientificTypes.jl reflecting how the data should be interpreted (for instance, Continuous or Multiclass).","category":"page"},{"location":"#","page":"Home","title":"Home","text":"A scientific type convention is an assignment of a scientific type to every Julia object, articulated by overloading the scitype method.  The MLJ convention is the one adopted in the MLJ ecosystem, although it may be used in other scientific/statistical software.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"This package additionally defines tools for type coercion (the coerce method) and scientific type \"guessing\" (the autotype method).","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Developers interested in implementing a different convention will instead import Scientific Types.jl, following the documentation there, possibly using this repo as a template.","category":"page"},{"location":"#Type-hierarchy-1","page":"Home","title":"Type hierarchy","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The supported scientific types have the following hierarchy:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Finite{N}\n├─ Multiclass{N}\n└─ OrderedFactor{N}\n\nInfinite\n├─ Continuous\n└─ Count\n\nImage{W,H}\n├─ ColorImage{W,H}\n└─ GrayImage{W,H}\n\nScientificTimeType\n├─ ScientificDate\n├─ ScientificTime\n└─ ScientificDateTime\n\nTable{K}\n\nTextual\n\nUnknown","category":"page"},{"location":"#Getting-started-1","page":"Home","title":"Getting started","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"This documentation focuses on properties of the scitype method specific to the MLJ convention. The scitype method satisfies certain universal properties, with respect to its operation on tuples, arrays and tables, set out in the ScientificTypes readme, but only implicitly described here.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"To get the scientific type of a Julia object defined by the MLJ convention, call scitype:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using MLJScientificTypes # hide\nscitype(3.14)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"For a vector, you can use scitype or elscitype (which will give you a scitype corresponding to the elements):","category":"page"},{"location":"#","page":"Home","title":"Home","text":"scitype([1,2,3,missing])","category":"page"},{"location":"#","page":"Home","title":"Home","text":"elscitype([1,2,3,missing])","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Occasionally, you may want to find the union of all scitypes of elements of an arbitrary iterable, which you can do with scitype_union:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"scitype_union((ifelse(isodd(i), i, missing) for i in 1:5))","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Note calling scitype_union on a large array, for example, is typically much slower than calling scitype or elscitype.","category":"page"},{"location":"#Summary-of-the-MLJ-convention-1","page":"Home","title":"Summary of the MLJ convention","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The table below summarizes the MLJ convention for representing scientific types:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Type T scitype(x) for x::T package required\nMissing Missing \nAbstractFloat Continuous \nInteger Count \nString Textual \nCategoricalValue Multiclass{N} where N = nlevels(x), provided x.pool.ordered == false CategoricalArrays\nCategoricalString Multiclass{N} where N = nlevels(x), provided x.pool.ordered == false CategoricalArrays\nCategoricalValue OrderedFactor{N} where N = nlevels(x), provided x.pool.ordered == true CategoricalArrays\nCategoricalString OrderedFactor{N} where N = nlevels(x) provided x.pool.ordered == true CategoricalArrays\nDate ScientificDate Dates\nTime ScientificTime Dates\nDateTime ScientificDateTime Dates\nAbstractArray{<:Gray,2} GrayImage{W,H} where (W, H) = size(x) ColorTypes\nAbstractArrray{<:AbstractRGB,2} ColorImage{W,H} where (W, H) = size(x) ColorTypes\nany table type T supported by Tables.jl Table{K} where K=Union{column_scitypes...} Tables","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Here nlevels(x) = length(levels(x.pool)).","category":"page"},{"location":"#Type-coercion-for-tabular-data-1","page":"Home","title":"Type coercion for tabular data","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"A common two-step work-flow is:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Inspect the schema of some table, and the column scitypes in particular.\nProvide pairs of column names and scitypes (or a dictionary) that change the column machine types to reflect the desired scientific interpretation (scitype).","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using MLJScientificTypes # hide\nusing DataFrames, Tables\nX = DataFrame(\n\t name=[\"Siri\", \"Robo\", \"Alexa\", \"Cortana\"],\n\t height=[152, missing, 148, 163],\n\t rating=[1, 5, 2, 1])\nschema(X)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"In some further analysis of the data in X, a more likely interpretation is that :name is Multiclass, the :height is Continuous, and the :rating an OrderedFactor. Correcting the types with coerce:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Xfixed = coerce(X, :name=>Multiclass,\n                   :height=>Continuous,\n                   :rating=>OrderedFactor)\nschema(Xfixed).scitypes","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Note that because missing values were encountered in height, an \"imperfect\" type coercion to Union{Missing,Continuous} has been performed, and a warning issued.  To avoid the warning, coerce to Union{Missing,Continuous} instead.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"\"Global\" replacements based on existing scientific types are also possible, and can be mixed with the name-based replacements:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"X  = (x = [1, 2, 3],\n\t  y = [:A, :B, :A],\n\t  z = [10, 20, 30])\nXfixed = coerce(X, Count=>Continuous, :y=>OrderedFactor)\nschema(Xfixed).scitypes","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Finally there is a coerce! method that does in-place coercion provided the data structure supports it.","category":"page"},{"location":"#Notes-1","page":"Home","title":"Notes","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"We regard the built-in Julia type Missing as a scientific type. \nFinite{N}, Multiclass{N} and OrderedFactor{N} are all parameterized by the number of levels N. We export the alias Binary = Finite{2}.\nImage{W,H}, GrayImage{W,H} and ColorImage{W,H} are all parameterized by the image width and height dimensions, (W, H).\nOn objects for which the MLJ convention has nothing to say, the scitype function returns Unknown.","category":"page"},{"location":"#Special-note-on-binary-data-1","page":"Home","title":"Special note on binary data","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"MLJScientificTypes does not define a separate \"binary\" scientific type. Rather, when binary data has an intrinsic \"true\" class (for example pass/fail in a product test), then it should be assigned an OrderedFactor{2} scitype, while data with no such class (e.g., gender) should be assigned a Multiclass{2} scitype. In the OrderedFactor{2} case MLJ adopts the convention that the \"true\" class come after the \"false\" class in the ordering (corresponding to the usual assignment \"false=0\" and \"true=1\"). Of course, Finite{2} covers both cases of binary data.","category":"page"},{"location":"#Detailed-usage-examples-1","page":"Home","title":"Detailed usage examples","text":"","category":"section"},{"location":"#Basics-1","page":"Home","title":"Basics","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"using MLJScientificTypes # hide\nusing CategoricalArrays\nscitype((2.718, 42))","category":"page"},{"location":"#","page":"Home","title":"Home","text":"In the MLJ convention, to construct arrays with categorical scientific element type one needs to use CategorialArrays:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"v = categorical(['a', 'c', 'a', missing, 'b'], ordered=true)\nscitype(v[1])","category":"page"},{"location":"#","page":"Home","title":"Home","text":"elscitype(v)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Coercing to Multiclass:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"w = coerce(v, Union{Missing,Multiclass})\nelscitype(w)","category":"page"},{"location":"#Working-with-tables-1","page":"Home","title":"Working with tables","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"While schema is convenient for inspecting the column scitypes of a table, there is also a scitype for the tables themselves:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using MLJScientificTypes # hide\ndata = (x1=rand(10), x2=rand(10))\nschema(data)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"scitype(data)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Similarly, any table implementing the Tables interface has scitype Table{K}, where K is the union of the scitypes of its columns.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Table scitypes are useful for dispatch and type checks, as shown here, with the help of a constructor for Table scitypes provided by Scientific Types.jl:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Table(Continuous, Count)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Table{<:Union{AbstractArray{<:Continuous},AbstractArray{<:Count}}}","category":"page"},{"location":"#","page":"Home","title":"Home","text":"scitype(data) <: Table(Continuous)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"scitype(data) <: Table(Infinite)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"data = (x=rand(10), y=collect(1:10), z = [1,2,3,1,2,3,1,2,3,1])\ndata = coerce(data, :z=>OrderedFactor)\nscitype(data) <: Table(Continuous,Count,OrderedFactor)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Note that Table(Continuous,Finite) is a type union and not a Table instance.","category":"page"},{"location":"#Tuples-and-arrays-1","page":"Home","title":"Tuples and arrays","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The behavior of scitype on tuples is as you would expect:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using MLJScientificTypes #hide\nscitype((1, 4.5))","category":"page"},{"location":"#","page":"Home","title":"Home","text":"For performance reasons, the behavior of scitype on arrays has some wrinkles, in the case of missing values:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The scitype of an array. The scitype of an AbstractArray, A, is alwaysAbstractArray{U} where U is the union of the scitypes of the elements of A, with one exception: If typeof(A) <: AbstractArray{Union{Missing,T}} for some T different from Any, then the scitype of A is AbstractArray{Union{Missing, U}}, where U is the union over all non-missing elements, even if A has no missing elements.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia> v = [1.3, 4.5, missing]\njulia> scitype(v)\nAbstractArray{Union{Missing, Continuous},1}","category":"page"},{"location":"#","page":"Home","title":"Home","text":"julia> scitype(v[1:2])\nAbstractArray{Union{Missing, Continuous},1}","category":"page"},{"location":"#Automatic-type-conversion-1","page":"Home","title":"Automatic type conversion","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"The autotype function allows to use specific rules in order to guess appropriate scientific types for tabular data. Such rules would typically be more constraining than the ones implied by the active convention. When autotype is used, a dictionary of suggested types is returned for each column in the data; if none of the specified rule applies, the ambient convention is used as \"fallback\".","category":"page"},{"location":"#","page":"Home","title":"Home","text":"The function is called as:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"autotype(X)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"If the keyword only_changes is passed set to true, then only the column names for which the suggested type is different from that provided by the convention are returned.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"autotype(X; only_changes=true)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"To specify which rules are to be applied, use the rules keyword  and specify a tuple of symbols referring to specific rules; the default rule is :few_to_finite which applies a heuristic for columns which have relatively few values, these columns are then encoded with an appropriate Finite type. It is important to note that the order in which the rules are specified matters; rules will be applied in that order.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"autotype(X; rules=(:few_to_finite,))","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Finally, you can also use the following shorthands:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"autotype(X, :few_to_finite)\nautotype(X, (:few_to_finite, :discrete_to_continuous))","category":"page"},{"location":"#Available-rules-1","page":"Home","title":"Available rules","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Rule symbol scitype suggestion\n:few_to_finite an appropriate Finite subtype for columns with few distinct values\n:discrete_to_continuous if not Finite, then Continuous for any Count or Integer scitypes/types\n:string_to_multiclass Multiclass for any string-like column","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Autotype can be used in conjunction with coerce:","category":"page"},{"location":"#","page":"Home","title":"Home","text":"X_coerced = coerce(X, autotype(X))","category":"page"},{"location":"#Examples-1","page":"Home","title":"Examples","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"By default it only applies the :few_to_many rule","category":"page"},{"location":"#","page":"Home","title":"Home","text":"using MLJScientificTypes # hide\nn = 50\nX = (a = rand(\"abc\", n),         # 3 values, not number        --> Multiclass\n\t b = rand([1,2,3,4], n),     # 4 values, number            --> OrderedFactor\n\t c = rand([true,false], n),  # 2 values, number but only 2 --> Multiclass\n\t d = randn(n),               # many values                 --> unchanged\n\t e = rand(collect(1:n), n))  # many values                 --> unchanged\nautotype(X, only_changes=true)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"For example, we could first apply the :discrete_to_continuous rule, followed by :few_to_finite rule. The first rule will apply to b and e but the subsequent application of the second rule will mean we will get the same result apart for e (which will be Continuous)","category":"page"},{"location":"#","page":"Home","title":"Home","text":"autotype(X, only_changes=true, rules=(:discrete_to_continuous, :few_to_finite))","category":"page"},{"location":"#","page":"Home","title":"Home","text":"One should check and possibly modify the returned dictionary before passing to coerce.","category":"page"},{"location":"#API-reference-1","page":"Home","title":"API reference","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"ScientificTypes.scitype\nScientificTypes.elscitype\nScientificTypes.scitype_union\ncoerce\nautotype","category":"page"},{"location":"#ScientificTypes.scitype","page":"Home","title":"ScientificTypes.scitype","text":"scitype(X)\n\nThe scientific type that X may represent.\n\n\n\n\n\n","category":"function"},{"location":"#ScientificTypes.elscitype","page":"Home","title":"ScientificTypes.elscitype","text":"elscitype(A)\n\nReturn the element scientific type of an abstract array A. By definition, if scitype(A) = AbstractArray{S,N}, then elscitype(A) = S.\n\n\n\n\n\n","category":"function"},{"location":"#ScientificTypes.scitype_union","page":"Home","title":"ScientificTypes.scitype_union","text":"scitype_union(A)\n\nReturn the type union, over all elements x generated by the iterable A, of scitype(x). See also scitype.\n\n\n\n\n\n","category":"function"},{"location":"#MLJScientificTypes.coerce","page":"Home","title":"MLJScientificTypes.coerce","text":"coerce(A, ...; tight=false, verbosity=1)\n\nGiven a table A, return a copy of A ensuring that the scitype of the columns match new specifications. The specifications can be given as a a bunch of colname=>Scitype pairs or as a dictionary whose keys are names and values are scientific types:\n\ncoerce(X, col1=>scitype1, col2=>scitype2, ... ; verbosity=1)\ncoerce(X, d::AbstractDict; verbosity=1)\n\nOne can also specify pairs of type T1=>T2 in which case all columns with scientific element type subtyping Union{T1,Missing} will be coerced to the new specified scitype T2.\n\nExamples\n\nSpecifiying (name, scitype) pairs:\n\nusing CategoricalArrays, DataFrames, Tables\nX = DataFrame(name=[\"Siri\", \"Robo\", \"Alexa\", \"Cortana\"],\n              height=[152, missing, 148, 163],\n              rating=[1, 5, 2, 1])\nXc = coerce(X, :name=>Multiclass, :height=>Continuous, :rating=>OrderedFactor)\nschema(Xc).scitypes # (Multiclass, Continuous, OrderedFactor)\n\nSpecifying (T1, T2) pairs:\n\nX  = (x = [1, 2, 3],\n      y = rand(3),\n      z = [10, 20, 30])\nXc = coerce(X, Count=>Continuous)\nschema(Xfixed).scitypes # (Continuous, Continuous, Continuous)\n\n\n\n\n\n","category":"function"},{"location":"#MLJScientificTypes.autotype","page":"Home","title":"MLJScientificTypes.autotype","text":"autotype(X; kw...)\n\nReturn a dictionary of suggested scitypes for each column of X, a table or an array based on rules\n\nKwargs\n\nonly_changes=true:       if true, return only a dictionary of the names for                             which applying autotype differs from just using                             the ambient convention. When coercing with                             autotype, only_changes should be true.\nrules=(:few_to_finite,): the set of rules to apply.\n\n\n\n\n\n","category":"function"}]
}
