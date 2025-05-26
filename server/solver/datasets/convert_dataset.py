import json
import os
import argparse

def tuple_key(k):
    # Convert "e1::p1" -> ('e1', 'p1')
    if isinstance(k, str) and "::" in k:
        return f"({repr(k.split('::')[0])}, {repr(k.split('::')[1])})"
    return repr(k)

def dump_dict(d, var_name, stringify_keys=False):
    lines = [f"{var_name} = {{"]
    for k, v in d.items():
        key_str = tuple_key(k) if stringify_keys else repr(k)
        lines.append(f"    {key_str}: {repr(v)},")
    lines.append("}\n")
    return "\n".join(lines)

def dump_list(name, lst):
    return f"{name} = {json.dumps(lst, indent=2)}\n"

def dump_list_of_tuples(name, lst):
    items = [f"({repr(a)}, {repr(b)})" for a, b in lst]
    joined = ",\n  ".join(items)
    return f"{name} = [\n  {joined}\n]\n"

def main():
    parser = argparse.ArgumentParser(description="Generate dataset.py from dataset.json")
    parser.add_argument(
        '--path',
        type=str,
        default="datasets/dataset.json",
        help="Path to the dataset JSON file (default: datasets/dataset.json)"
    )
    args = parser.parse_args() 

    input_path = args.path
 
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    output_path = f"python/{base_name}.py"

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    sections = []
    sections.append(dump_list("E", data["E"]))
    sections.append(dump_list("P", data["P"]))
    sections.append(dump_list("T", data["T"]))
    sections.append(dump_dict(data["places"], "places"))
    sections.append(dump_dict(data["classe"], "classe"))
    sections.append(dump_dict(data["t_pref"], "t_pref"))
    sections.append(dump_dict(data["t_aimes"], "t_aimes"))
    sections.append(dump_dict(data["t_prim"], "t_prim"))
    sections.append(dump_dict(data["t_anx"], "t_anx"))
    sections.append(dump_dict(data["difficulty"], "difficulty"))
    sections.append(dump_list_of_tuples("N", data["N"]))
    sections.append(dump_dict(data["note"], "note", stringify_keys=True))
    sections.append(dump_dict(data["difficulty_old"], "difficulty_old"))
    sections.append(dump_list_of_tuples("B_minus", data["B_minus"]))
    sections.append(dump_dict(data["affinity"], "affinity", stringify_keys=True))

    final = "\n\n".join(sections)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("# Auto-generated dataset file\n\n")
        f.write(final)

    print(f"Dataset regenerated at {output_path}")

if __name__ == "__main__":
    main()