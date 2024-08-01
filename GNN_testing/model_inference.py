import torch
import dgl


model = GraphSAGE()
model.load_state_dict(torch.load("REALmodel.pth"))
model.eval()

# 